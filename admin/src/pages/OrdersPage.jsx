import {orderApi} from "../lib/api.js"
import {formatDate} from "../lib/util.js"
import {useMutation, useQuery, useQueryClient}  from "@tanstack/react-query"
function OrdersPage() {
  const queryClient = useQueryClient();
  const {data:ordersData,isLoading} = useQuery({
    queryKey:["orders"],
    queryFn: orderApi.getAll,
  })

  const updateStatusMutation = useMutation({
    mutationFn:orderApi.updateStatus,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["orders"]});
      queryClient.invalidateQueries({queryKey:["dashboardStats"]});
    },
  });
  const handleStatusChange = (orderId, newStatus)=>{
    updateStatusMutation.mutate({orderId, status:newStatus})
  };
  const order = ordersData?.orders || [];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          <p className="text-base-content/70">Manage customer orders</p>
        </h1>
      </div>
      {/**order table */}
      <div  className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"/>
            </div>
          ): order.length === 0 ?(
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No orders yet</p>
              <p className="text-sm">orders will appear here once customer make purchases</p>
            </div>
          ):(
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {order.map((order)=>{
                    const totalQuantity = order.orderItems.reduce(
                      (sum,item) => sum + item.quantity,
                      0
                    );

                    return (
                      <tr key={order._id}>
                         <td>
                          <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                         </td>
                         <td>
                          <div className="font-medium">{order.shippingAddress.fullName}</div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress.city},{order.shippingAddress.state}
                          </div>
                         </td>

                         <td>
                          <div className="font-medium">{totalQuantity} items</div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 && `+${order.orderItems.length -1} more`}
                          </div>
                         </td>

                         <td>
                          <span className="font-semibold ">${order.totalPrice.toFixed(2)}</span>
                         </td>

                         <td>
                          <select value={order.status} 
                          onChange={(e)=>handleStatusChange(order._id, e.target.value)}
                          className="select select-sm"
                          disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                         </td>

                         <td>
                          <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
                         </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
