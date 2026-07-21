export interface ContactOption {
  id: number;
  name: string;
  email: string;
  mobile: string;
  company: string;
  status: "Active" | "Inactive";
}

export const contacts: ContactOption[] = [
  { id: 1, name: "Navith", email: "navith@gmail.com", mobile: "9876543210", company: "Stonebuild", status: "Active" },
  { id: 2, name: "Ajay", email: "ajay@gmail.com", mobile: "9876543211", company: "Stonebuild", status: "Active" },
  { id: 3, name: "Hari", email: "hari@gmail.com", mobile: "9876543212", company: "Stonebuild", status: "Inactive" },
  { id: 4, name: "Praveen", email: "praveen@gmail.com", mobile: "9876543213", company: "Stonebuild", status: "Active" },
  { id: 5, name: "Karthik", email: "karthik@gmail.com", mobile: "9876543214", company: "Stonebuild", status: "Active" },
  { id: 6, name: "Sathish", email: "sathish@gmail.com", mobile: "9876543215", company: "Stonebuild", status: "Inactive" },
  { id: 7, name: "Arun", email: "arun@gmail.com", mobile: "9876543216", company: "Stonebuild", status: "Active" },
  { id: 8, name: "Vijay", email: "vijay@gmail.com", mobile: "9876543217", company: "Stonebuild", status: "Active" },
  { id: 9, name: "Rahul", email: "rahul@gmail.com", mobile: "9876543218", company: "Stonebuild", status: "Inactive" },
  { id: 10, name: "Manoj", email: "manoj@gmail.com", mobile: "9876543219", company: "Stonebuild", status: "Active" },
  { id: 11, name: "Suresh", email: "suresh@gmail.com", mobile: "9876543220", company: "Stonebuild", status: "Active" },
  { id: 12, name: "Dinesh", email: "dinesh@gmail.com", mobile: "9876543221", company: "Stonebuild", status: "Active" },
  { id: 13, name: "Ramesh", email: "ramesh@gmail.com", mobile: "9876543222", company: "Stonebuild", status: "Inactive" },
  { id: 14, name: "Surya", email: "surya@gmail.com", mobile: "9876543223", company: "Stonebuild", status: "Active" },
  { id: 15, name: "Naveen", email: "naveen@gmail.com", mobile: "9876543224", company: "Stonebuild", status: "Active" },
  { id: 16, name: "Deepak", email: "deepak@gmail.com", mobile: "9876543225", company: "Stonebuild", status: "Active" },
  { id: 17, name: "Bala", email: "bala@gmail.com", mobile: "9876543226", company: "Stonebuild", status: "Inactive" },
  { id: 18, name: "Vignesh", email: "vignesh@gmail.com", mobile: "9876543227", company: "Stonebuild", status: "Active" },
  { id: 19, name: "Santhosh", email: "santhosh@gmail.com", mobile: "9876543228", company: "Stonebuild", status: "Active" },
  { id: 20, name: "Gokul", email: "gokul@gmail.com", mobile: "9876543229", company: "Stonebuild", status: "Inactive" },
];
