import * as assert from "assert";
import { validateCronExpression } from "../utils";

suite("Utils Test Suite", () => {
  suite("validateCronExpression", () => {
    suite("validate minutes", () => {
      test("validateMinutes should return true for valid minutes", () => {
        const MinutesArray = [
          "*",
          "0",
          "5",
          "9",
          "00",
          "05",
          "09",
          "15",
          "50",
          "0-6",
          "0-59",
          "10-32",
          "0/15",
          "10/10",
          "10/3",
          "3,4,5",
          "4,5-7,9",
          "4,10,40-59,10/3",
        ];
        MinutesArray.forEach((element) => {
          assert.strictEqual(
            validateCronExpression(`${element} * * * *`),
            true,
            `Error: Expected "${element}" to strictly equal true`
          );
        });
      });

      test("validateMinutes should return false for invalid minutes", () => {
        const MinutesArray = [
          "invalid",
          "60",
          "70",
          "99",
          "00-99",
          "4,5-7,",
          "-1",
          "-10",
          "100",
          "-10-30",
          "-3,5,6,7",
          "3,4,5,-7,",
          "-3,5,6,7-10",
          "3,4,5,-7,-7-10",
          "-3,5,6,7-10,10/10",
          "3,4,5,-7,-7-10,0/5",
        ];
        MinutesArray.forEach((element) => {
          assert.strictEqual(
            validateCronExpression(`${element} * * * *`),
            false,
            `Error: Expected "${element}" to strictly equal "false"`
          );
        });
      });
    });

    suite("validate hours", () => {
      test("validateHours should return true for valid hours", () => {
        const HoursArray = [
          "*",
          "0",
          "5",
          "9",
          "15",
          "23",
          "0-6",
          "0-23",
          "10-22",
          "0/12",
          "10/10",
          "10/3",
          "3,4,5",
          "4,5-7,9",
          "4,10,10-19,10/3",
        ];
        HoursArray.forEach((element) => {
          assert.strictEqual(
            validateCronExpression(`* ${element} * * *`),
            true,
            `Error: Expected "${element}" to strictly equal true`
          );
        });
      });

      test("validateHours should return false for invalid hours", () => {
        const HoursArray = [
          "invalid",
          "24",
          "25",
          "99",
          "00-99",
          "-10-23",
          "4,5-7,",
          "-1",
          "-10",
          "100",
          "-10-30",
          "-3,5,6,7",
          "3,4,5,-7,",
          "-3,5,6,7-10",
          "3,4,5,-7,-7-10",
          "-3,5,6,7-10,10/10",
          "3,4,5,-7,-7-10,0/5",
        ];
        HoursArray.forEach((element) => {
          assert.strictEqual(
            validateCronExpression(`* ${element} * * *`),
            false,
            `Error: Expected "${element}" to strictly equal "false"`
          );
        });
      });
    });
  });
});
