import React from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import {
  capitalizeText,
  formatDate,
  getOrderStatusBadge,
} from "../lib/util.js";
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
        : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
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
  return (
    <div className="space-y-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {
          statsCard.map((stat) => (
            <div key={stat.name} className="stat">
              <div className="stat-figure text-primary">{stat.icon}</div>
              <div className="stat-title">{stat.name}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))

          // recent order table
        }
      </div>
      {/** recent order table*/}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2>Recent Orders</h2>
          {orderLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thread>
                  <tr>
                    <th>Order ID</th>
                    <th>Customers</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thread>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress?.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems.length} items(s)
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {order.orderItems[0]?.name}
                          {order.orderItems.length > 1 &&
                            `+${order.orderItems.length - 1} more`}
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold">
                          {order.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div
                          className={`badge ${getOrderStatusBadge(order.status)}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
