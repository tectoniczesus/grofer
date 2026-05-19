import React from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import {
  DollarSignIcon,
  icons,
  PackageIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
function DashboardPage() {
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboards"],
    queryFn: statsApi.getDashboard,
  });
  const recentOrders = orderData?.orders?.slice(0, 5) || [];
  const statsCard = [
    {
      name: "Total Revenue",
      value: statsLoading
        ? "..."
        : `$${statsData.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-8" />,
    },
    {
      name: "Total Orders",
      value: statsLoading ? "..." : statsData?.totalOrder || 0,
      icon: <ShoppingBagIcon className="size-8" />,
    },
    {
      name: "Total Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UserIcon className="size-8" />,
    },
    {
      name: "Total Products",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-8" />,
    },
  ];
  //FIXME: not showing correct number of customers
  //DONE: was auth middleware problem 
  return <div className="space-y-6">
  
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
       {
        statsCard.map((stat)=>(
          <div key={stat.name} className="stat">
            <div className="stat-figure text-primary">{stat.icon}</div>
            <div className="stat-title">{stat.name}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))

        // recent order table
       }
    </div>

  </div>;
}

export default DashboardPage;
