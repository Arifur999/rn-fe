// Shapes the API sends (dates "YYYY-MM-DD", money as numbers).

export type CarType = "car" | "micro" | "hiace" | "bus" | "other";
export type CarStatus = "active" | "maintenance" | "inactive";
export type DriverStatus = "active" | "inactive";
export type TripStatus = "running" | "completed" | "cancelled";
export type ExpenseCategory = "fuel" | "toll" | "parking" | "repair" | "driver_payment" | "food" | "other";

export type Role = "super_admin" | "owner";

export interface IAdmin {
  name: string;
  email: string;
  role: Role;
  business_name: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface ICar {
  id: string;
  name: string;
  number: string;
  type: CarType;
  status: CarStatus;
  fitness_expiry: string | null;
  tax_token_expiry: string | null;
  insurance_expiry: string | null;
  route_permit_expiry: string | null;
  note: string | null;
  created_at: string;
}

export interface ICarRef {
  id: string;
  name: string;
  number: string;
}

export interface IDriver {
  id: string;
  name: string;
  phone: string;
  license_number: string | null;
  address: string | null;
  joined_at: string | null;
  default_car_id: string | null;
  default_car: ICarRef | null;
  status: DriverStatus;
  note: string | null;
  created_at: string;
}

export interface ITripExpense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  note: string | null;
}

export interface ITrip {
  id: string;
  trip_date: string;
  car_id: string;
  driver_id: string;
  from_place: string;
  to_place: string;
  customer_name: string | null;
  customer_phone: string | null;
  out_time: string | null;
  return_time: string | null;
  fare: number;
  paid: number;
  due: number;
  expense_total: number;
  status: TripStatus;
  note: string | null;
  car: ICarRef;
  driver: { id: string; name: string; phone: string };
  expenses: ITripExpense[];
}

export interface IExpense {
  id: string;
  expense_date: string;
  category: ExpenseCategory;
  amount: number;
  car_id: string | null;
  driver_id: string | null;
  trip_id: string | null;
  note: string | null;
  car: ICarRef | null;
  driver: { id: string; name: string } | null;
  trip: { id: string; from_place: string; to_place: string; trip_date: string } | null;
}

export interface ITotals {
  trips: number;
  fare: number;
  income: number;
  expense: number;
  profit: number;
  due: number;
}

export interface IRecentTrip {
  id: string;
  trip_date: string;
  from_place: string;
  to_place: string;
  fare: number;
  paid: number;
  status: TripStatus;
  driver?: { id: string; name: string };
  car?: ICarRef;
}

export interface ICarSummary {
  car: ICar;
  range: { from: string; to: string };
  totals: ITotals;
  recent_trips: IRecentTrip[];
}

export interface IDriverSummary {
  driver: IDriver;
  range: { from: string; to: string };
  totals: ITotals & { paid_to_driver: number };
  recent_trips: IRecentTrip[];
}

export interface IExpiryAlert {
  car_id: string;
  car_name: string;
  car_number: string;
  document: string;
  expiry_date: string;
  days_left: number;
}

export interface IDashboard {
  range: { from: string; to: string };
  today: string;
  totals: ITotals;
  per_car: (ICarRef & { status: CarStatus; trips: number; income: number })[];
  idle_cars: number;
  per_driver: { id: string; name: string; phone: string; trips: number; income: number }[];
  expense_by_category: { category: ExpenseCategory; amount: number }[];
  chart: { date: string; income: number; expense: number }[];
  due: {
    total: number;
    count: number;
    trips: {
      id: string;
      trip_date: string;
      customer_name: string | null;
      customer_phone: string | null;
      from_place: string;
      to_place: string;
      fare: number;
      paid: number;
      due: number;
      car: { name: string; number: string };
    }[];
  };
  expiry_alerts: IExpiryAlert[];
}

export interface ILoginResult {
  token: string;
  expires_at: string;
  admin: IAdmin;
}
