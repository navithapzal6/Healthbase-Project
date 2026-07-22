"use client";

import { useState } from "react";

import {
  Button,
  Input,
  Checkbox,
  Textarea,
  toast,
  Modal,
  Dialog,
  Sidebar,
} from "@/src/components";

import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Check,
  Search,
  Eye,
  LayoutDashboard,
  Package,
  Truck,
  Settings,
  User,
} from "lucide-react";

export default function Home() {
  //   const [collapsed, setCollapsed] = useState(false);

  // const sidebarItems = [
  //   {
  //     icon: '📊',
  //     label: 'Dashboard',
  //     href: '/dashboard'
  //   },
  //   {
  //     icon: '📧',
  //     label: 'Inbox',
  //     href: '/inbox'
  //   },
  //   {
  //     icon: '📅',
  //     label: 'Calendar',
  //     href: '/calendar'
  //   },
  //   {
  //     icon: '👥',
  //     label: 'Employees',
  //     href: '/employees',
  //     active: true,
  //     children: [
  //       { icon: '✅', label: 'Attendance', href: '/employees/attendance' },
  //       { icon: '📈', label: 'Performance', href: '/employees/performance' },
  //       { icon: '💰', label: 'Payroll', href: '/employees/payroll' },
  //       { icon: '🏖️', label: 'Leave Management', href: '/employees/leave' },
  //     ],
  //   },
  // ];

  return (
    <div className="space-y-6">
      <div className="ui-card p-6">
        <h1 className="text-3xl font-bold text-[#103BB5]">Dashboard</h1>

        <p className="mt-2 text-slate-500">Welcome to Stonebuild ERP</p>
      </div>
    </div>

    //  <div className="flex min-h-screen bg-gray-50">
    //   {/* Sidebar Only - No Header */}
    //   <Sidebar
    //     items={sidebarItems}
    //     collapsed={collapsed}
    //     onToggle={() => setCollapsed(!collapsed)}
    //   />

    //   {/* Main Content Area */}
    //   <div className="flex-1 p-6">
    //     <div className="bg-white rounded-lg shadow p-6">
    //       <h2 className="text-xl font-bold text-gray-800">Sidebar Test Page</h2>
    //       <p className="text-gray-600 mt-2">
    //         Click the toggle button at the bottom of sidebar to collapse/expand
    //       </p>
    //       <p className="text-gray-600 mt-1">
    //         Click <strong>Employees</strong> to see sub-menu items
    //       </p>
    //       <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
    //         <p className="text-sm text-blue-700">
    //           ✅ Sidebar is working! No Header included.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    // Button
    // <main className="p-10">
    //   <div className="flex flex-wrap gap-5">

    //     <Button>Login</Button>

    //     <Button
    //       variant="success"
    //       leftIcon={<Check size={18} />}
    //     >
    //       Success
    //     </Button>

    //     <Button
    //       variant="destructive"
    //       leftIcon={<Trash2 size={18} />}
    //     >
    //       Delete
    //     </Button>

    //     <Button variant="outline">
    //       Cancel
    //     </Button>

    //     <Button variant="ghost">
    //       Ghost
    //     </Button>

    //     <Button variant="link">
    //       Learn More
    //     </Button>

    //     <Button
    //       rightIcon={<ArrowRight size={18} />}
    //     >
    //       Continue
    //     </Button>

    //     <Button
    //       leftIcon={<ArrowLeft size={18} />}
    //     >
    //       Back
    //     </Button>

    //     <Button loading />

    //     <Button size="lg">
    //       Large Button
    //     </Button>

    //   </div>

    //   <div className="mt-10 w-80">
    //     <Button fullWidth>
    //       Full Width Button
    //     </Button>
    //   </div>
    // </main>

    // Input
    // <main className="max-w-xl space-y-6 p-10">

    //   <Input
    //     label="Email"
    //     placeholder="Enter your email"
    //   />

    //   <Input
    //     label="Search"
    //     placeholder="Search..."
    //     leftIcon={<Search size={18} />}
    //   />

    //   <Input
    //     label="Password"
    //     type="password"
    //     rightIcon={<Eye size={18} />}
    //   />

    //   <Input
    //     label="Username"
    //     helperText="Minimum 5 characters"
    //   />

    //   <Input
    //     label="Email"
    //     error="Email is required"
    //   />

    //   <Input
    //     label="Full Width"
    //     fullWidth
    //   />

    //   <Input
    //     label="Filled"
    //     variant="filled"
    //   />

    //   <Input
    //     label="Outline"
    //     variant="outline"
    //   />

    // </main>

    // Text Area
    // <main className="min-h-screen bg-slate-100 p-6">
    //   <div className="mx-auto max-w-7xl">

    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    //       {/* Left Side */}
    //       <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
    //         <Input
    //           label="Email"
    //           placeholder="Enter email"
    //         />

    //         <Textarea
    //           label="Description"
    //           placeholder="Type here..."
    //         />
    //           <Textarea
    //             label="Disabled"
    //             disabled
    //           />

    //           <Textarea
    //   label="Helper"
    //   helperText="Maximum 500 characters"
    // />
    //       </div>

    //       {/* Right Side */}
    //       <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">

    //         <Input
    //           label="Password"
    //           placeholder="Password"
    //         />

    //         <Textarea
    //           label="Comments"
    //           placeholder="Comments..."
    //         />
    // <Textarea
    //   label="Large"
    //   size="lg"
    // />

    // <Textarea
    //   label="Error"
    //   error="Description is required"
    // />
    // <Textarea
    //   label="Full Width"
    //   fullWidth
    // />

    //       </div>

    //     </div>

    //   </div>
    // </main>

    // Check Box
    // <main className="min-h-screen bg-slate-100 p-10">

    //       <div className="rounded-2xl bg-white p-10 shadow-md space-y-8">

    //         <Checkbox
    //           label="Remember me"
    //         />

    //         <Checkbox
    //           label="Accept Terms"
    //           defaultChecked
    //         />

    //         <Checkbox
    //           label="Receive Notifications"
    //         />

    //         <Checkbox
    //           label="Disabled"
    //           disabled
    //         />

    //         <Checkbox
    //           size="lg"
    //           label="Large Checkbox"
    //         />

    //         <Checkbox
    //           label="Helper Text"
    //           helperText="This is helper text."
    //         />

    //         <Checkbox
    //           label="Error"
    //           error="This field is required."
    //         />

    //       </div>

    //     </main>

    // Toaster
    // <main className="min-h-screen bg-slate-100 p-10">

    //   <div className="flex flex-wrap gap-4">
    //     <Button
    //       onClick={() =>
    //         toast.success({
    //           title: "Success",
    //           description: "Employee created successfully.",
    //         })
    //       }
    //     >
    //       Success
    //     </Button>

    //     <Button
    //       onClick={() =>
    //         toast.error({
    //           title: "Error",
    //           description: "Error - Something went wrong.",
    //         })
    //       }
    //     >
    //       Error
    //     </Button>

    //     <Button
    //       onClick={() =>
    //         toast.warning({
    //           title: "Warning",
    //           description: "Warning - Be Careful On Next Step.",
    //         })
    //       }
    //     >
    //       Warning
    //     </Button>

    //     <Button
    //       onClick={() =>
    //         toast.info({
    //           title: "Info",
    //           description: "Info - This is Information Alert.",
    //         })
    //       }
    //     >
    //       Info
    //     </Button>

    //   </div>

    // </main>

    // Modal
    //       <main className="min-h-screen bg-slate-100 p-10">
    //         <div className="flex flex-wrap gap-4">
    //           <Button>Login</Button>

    //           <Button onClick={() => setOpen(true)}>
    //         Open Modal
    //       </Button>

    //       <Modal
    //         open={open}
    //         onClose={() => setOpen(false)}
    //         title="Create Employee"
    //         description="Fill all required fields."
    //       >
    //         <p>Hello Modal</p>

    // </Modal>

    //           </div>
    //           </main>

    // Side Bar

    // <div className="flex">

    //       <Sidebar
    //         logo={
    //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
    //             S
    //           </div>
    //         }
    //         items={[
    //           {
    //             id: "1",
    //             label: "Dashboard",
    //             href: "/",
    //             icon: <LayoutDashboard size={18} />,
    //             active: true,
    //           },
    //           {
    //             id: "2",
    //             label: "Orders",
    //             href: "/orders",
    //             icon: <Package size={18} />,
    //             badge: 12,
    //           },
    //           {
    //             id: "3",
    //             label: "Trip Management",
    //             href: "#",
    //             icon: <Truck size={18} />,
    //             children: [
    //               {
    //                 id: "31",
    //                 label: "Trips",
    //                 href: "/trips",
    //               },
    //               {
    //                 id: "32",
    //                 label: "Drivers",
    //                 href: "/drivers",
    //               },
    //             ],
    //           },
    //         ]}
    //         footer={
    //           <SidebarItem
    //             item={{
    //               id: "4",
    //               label: "Settings",
    //               href: "/settings",
    //               icon: <Settings size={18} />,
    //             }}
    //           />
    //         }
    //       />

    //       <main className="flex-1 p-8">

    //         <h1 className="text-3xl font-bold">
    //           Dashboard
    //         </h1>

    //       </main>

    //     </div>

    //

    //dialog

    // <div className="p-10">

    //     <Button
    //       onClick={() => setOpen(true)}
    //     >
    //       Open Dialog
    //     </Button>

    //     <Dialog
    //       open={open}
    //       title="Cookie Settings"
    //       description="We use cookies to improve your experience. By clicking Accept, you agree to our use of cookies."
    //       confirmText="Accept"
    //       cancelText="Decline"
    //       onConfirm={() => setOpen(false)}
    //       onCancel={() => setOpen(false)}
    //     />

    // </div>
  );
}
