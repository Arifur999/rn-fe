import { describe, expect, it } from "vitest";
import { changePasswordFormZodSchema } from "./auth.validation";
import { carFormZodSchema, emptyCarForm } from "./car.validation";
import { driverFormZodSchema, emptyDriverForm } from "./driver.validation";
import { emptyExpenseForm, expenseFormZodSchema } from "./expense.validation";
import { emptyTripForm, tripFormZodSchema } from "./trip.validation";

const ID = "8b3f7c0e-1a2b-4c3d-9e8f-0a1b2c3d4e5f";

describe("trip form", () => {
  const valid = emptyTripForm("2026-11-25", {
    car_id: ID,
    driver_id: ID,
    from_place: " ঢাকা ",
    to_place: "কক্সবাজার",
    fare: "১২,০০০",
    paid: "5000",
    expenses: [{ category: "fuel", amount: "৩০০০", note: "" }],
  });

  it("turns strings (and Bangla digits) into the API payload", () => {
    const out = tripFormZodSchema.parse(valid);
    expect(out).toMatchObject({ from_place: "ঢাকা", fare: 12000, paid: 5000, out_time: null, customer_name: null });
    expect(out.expenses[0]).toEqual({ category: "fuel", amount: 3000, note: null });
  });

  it("treats an empty paid as 0", () => {
    expect(tripFormZodSchema.parse({ ...valid, paid: "" }).paid).toBe(0);
  });

  it("rejects paid over fare, missing car, bad fare", () => {
    const result = tripFormZodSchema.safeParse({ ...valid, paid: "20000", car_id: "", fare: "abc" });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path.join("."));
    expect(paths).toContain("car_id");
    expect(paths).toContain("fare");
  });

  it("rejects paid over fare on its own", () => {
    const result = tripFormZodSchema.safeParse({ ...valid, paid: "20000" });
    expect(result.error?.issues[0]?.path).toEqual(["paid"]);
  });
});

describe("other forms", () => {
  it("car: empty dates become null", () => {
    const out = carFormZodSchema.parse({ ...emptyCarForm, name: "Noah", number: "ঢাকা মেট্রো-চ ১২" });
    expect(out.fitness_expiry).toBeNull();
    expect(out.note).toBeNull();
  });

  it("driver: phone digits normalized", () => {
    const out = driverFormZodSchema.parse({ ...emptyDriverForm, name: "করিম", phone: "০১৭১১০০০০০০" });
    expect(out.phone).toBe("01711000000");
    expect(out.default_car_id).toBeNull();
  });

  it("expense: amount must be positive", () => {
    expect(expenseFormZodSchema.safeParse({ ...emptyExpenseForm("2026-11-25"), amount: "0" }).success).toBe(false);
    expect(expenseFormZodSchema.parse({ ...emptyExpenseForm("2026-11-25"), amount: "500" }).amount).toBe(500);
  });

  it("password: confirm must match, output drops confirm", () => {
    expect(
      changePasswordFormZodSchema.safeParse({ current_password: "a", new_password: "abcdef", confirm_password: "x" }).success,
    ).toBe(false);
    expect(
      changePasswordFormZodSchema.parse({ current_password: "a", new_password: "abcdef", confirm_password: "abcdef" }),
    ).toEqual({ current_password: "a", new_password: "abcdef" });
  });
});
