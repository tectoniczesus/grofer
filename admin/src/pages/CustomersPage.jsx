import {useQuery} from "@tanstack/react-query"
import {formatDate} from "../lib/util"
import { customerApi } from "../lib/api"
function CustomersPage() {
  const {data,isLoading} = useQuery({
    queryKey:["customers"],
    queryFn:customerApi.getAll,
  });
  const customers = data?.customers || []
  return (
    <div className="space-6">
      {/*Headers */}
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-base-content/70 mt-1">
          {customers.length} {customers.length===1 ? "customer" : "customers"} registered
        </p>
      </div>


      {/*customers table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ?(
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"/>
            </div>
          ): customers.length === 0 ?(
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No Customer yet</p>
              <p className="text-sm">Customers will show here once they sign up</p>
            </div>
          ):(
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Wishlist</th>
                  <th>Joined Date</th>
                </tr>
                </thead>

                <tbody>
                  {customers.map((customer)=>(
                    <tr key={customer._id}>
                      <td className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12">
                            {/* email profile pic  is not showing up */}
                            <img src={customer.imageUrl} alt={customer.fullName}  className="w-12 h-12 rounded-full"/>
                          </div>
                        </div>
                        <div className="font-semibold">
                          {customer.name}
                        </div>
                      </td>
                      <td >
                        {customer.email}
                      </td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>

                      <td>
                        <span className="text-sm opacity-60">{formatDate(customer.createdAt)}</span>
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
  )
}

export default CustomersPage
