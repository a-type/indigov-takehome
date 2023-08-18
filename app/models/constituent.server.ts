import { prisma } from "~/db.server";
import { parse as parseCsv } from "csv-parse/sync";
import * as zod from "zod";
import type { Constituent } from "@prisma/client";

export function getConstituents(): Promise<Constituent[]> {
  // FIXME: sending back raw database rows isn't a good idea.
  // I'd set up some kind of known typing for user-facing data and
  // reusable utilities to map database rows to those types.
  return prisma.constituent.findMany({
    orderBy: { firstName: "asc" },
  });
}

const recordSchema = zod.object({
  first_name: zod.string(),
  last_name: zod.string(),
  email: zod.string().email(),
  phone_number: zod.string(),
  street_address_1: zod.string(),
  street_address_2: zod.string().optional(),
  city: zod.string(),
  state: zod.string(),
  zip_code: zod.string(),
});

/**
 * Load constituents from a CSV file. The file should have the following columns:
 * first_name | last_name | email | phone_number | street_address_1 | street_address_2 | city | state | zip_code
 */
export function loadConstituentsFromFile(
  csvFileContent: string | Buffer
): Promise<Constituent[]> {
  // note: right now I'm taking the full contents of the file and doing sync parsing. this is
  // fine for the size of files we're dealing with. but if they get larger, I'd upgrade to streaming
  // the incoming file and piping it to CSV's streaming parser, then loading the records
  // into the database as they come in within an enclosing transaction.
  const records: unknown[] = parseCsv(csvFileContent, {
    columns: [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "street_address_1",
      "street_address_2",
      "city",
      "state",
      "zip_code",
    ],
    skip_empty_lines: true,
    autoParse: true,
    // 1-indexed, really?
    from_line: 2,
  });

  // using Zod to enforce the correct formatting and types of the incoming data
  const parsedRecords = records.map((record) => {
    try {
      return recordSchema.parse(record);
    } catch (err) {
      console.error(`Failed to parse record: ${JSON.stringify(record)}`);
      throw err;
    }
  });

  // using a transaction, just kind of habit for bulk operations. normally I'd discuss
  // on a product level what users expect; if they would want to have a partial success
  // and then re-submit a subset of any records which failed, or just fix the original
  // file and retry.
  return prisma.$transaction(
    parsedRecords.map((record) =>
      prisma.constituent.upsert({
        where: { email: record.email },
        create: {
          firstName: record.first_name,
          lastName: record.last_name,
          email: record.email,
          phoneNumber: record.phone_number,
          streetAddress1: record.street_address_1,
          streetAddress2: record.street_address_2,
          city: record.city,
          state: record.state,
          zipCode: record.zip_code,
        },
        update: {
          // email is omitted for updates, since that's what we're keying on.
          // while you *could* consolidate these two objects, I tend to default
          // to explicit separation for database writes. seen too many cases where
          // somebody modifies a DRY object and then it breaks something else or
          // writes the wrong data in a particular scenario, etc.
          firstName: record.first_name,
          lastName: record.last_name,
          phoneNumber: record.phone_number,
          streetAddress1: record.street_address_1,
          streetAddress2: record.street_address_2,
          city: record.city,
          state: record.state,
          zipCode: record.zip_code,
        },
      })
    )
  );
}
