import { CartContext } from "@contexts/CartContext";
import AlgerianCities from "@data/AlgerianCities";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";

interface User {
  name: string;
  phoneNumber: string;
  address: {
    state: number;
    city: number;
    homeAddress: string;
  };
}

const toPriceForm = (price?: number) =>
  price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "0";

function OrderSummary() {
  const { cart, setCart } = useContext(CartContext);
  const total = toPriceForm(
    cart?.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );

  const [user, setUser] = useState<User>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const HandleConfirmOrder = async () => {
    if (!setCart) return;
    if (total === "0") return toast.error("Your cart is empty");
    if (!user?.name || !user?.phoneNumber || !user?.address.homeAddress)
      return toast.error("Please fill all the fields");
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        address: user?.address,
        name: user?.name,
        phoneNumber: user?.phoneNumber,
      }),
    });

    setLoading(false);
    if (!res.ok) return;
    const { missingItems } = await res.json();
    toast.success("Order Confirmed");
    if (missingItems) toast.error("Some items are out of stock");
    setCart([]);
    if (!session?.user) localStorage.removeItem("cart");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok)
        return setUser({
          address: {
            state: 1,
            city: 0,
            homeAddress: "",
          },
          name: "",
          phoneNumber: "",
        });

      const userData = await res.json();
      setUser({
        address: {
          state: 1,
          city: 0,
          homeAddress: "",
        },
        ...userData.user,
      });
    };
    fetchUserInfo();
  }, []);

  return (
    <section className="ml-auto w-full">
      <h1 className="p-4 border-b text-lg text-[#2e385a] font-semibold">
        Order Summary
      </h1>
      <div className="bg-white shadow-md rounded-lg text-xs md:text-base flex md:items-center flex-col md:flex-row">
        <div className="p-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            value={user?.name ?? ""}
            disabled={!user || session?.user}
            onChange={(e) =>
              setUser((prev) => ({ ...prev!, name: e.target.value }))
            }
            className={`mb-5 rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20
              ${!user || session?.user ? "bg-gray-3" : ""}`}
          />

          <div
            className={`mb-5 p-4 flex items-center rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 
              ${!user || session?.user ? "bg-gray-3" : ""}`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg"
              alt="Algeria Flag"
              className="w-6 h-4 mr-2"
            />
            <p>0</p>
            <input
              id="phoneNumber"
              type="number"
              className="focus:outline-none bg-transparent flex-1"
              value={user?.phoneNumber ? Number(user?.phoneNumber) : ""}
              disabled={!user || session?.user}
              onChange={(e) =>
                setUser((prev) => ({ ...prev!, phoneNumber: e.target.value }))
              }
            />
          </div>

          <div className="relative mb-5">
            <select
              name="state"
              value={user?.address.state}
              disabled={!user}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev!,
                  address: {
                    homeAddress: prev!.address.homeAddress,
                    state: Number(e.target.value),
                    city: 0,
                  },
                }))
              }
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              {AlgerianCities.map((state) => (
                <option key={state[0].wilaya_id} value={state[0].wilaya_id}>
                  {state[0].name}
                </option>
              ))}
            </select>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>

          <div className="relative mb-5">
            <select
              name="city"
              value={user?.address.city}
              disabled={!user}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev!,
                  address: {
                    ...prev!.address,
                    city: Number(e.target.value),
                  },
                }))
              }
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              {AlgerianCities[user ? user.address.state - 1 : 0].map(
                (city, index) => (
                  <option key={index} value={index}>
                    {city.name}
                  </option>
                )
              )}
            </select>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>

          <textarea
            name="Homeaddress"
            id="Homeaddress"
            placeholder="City 1850 logts, apt 19"
            value={user?.address?.homeAddress ?? ""}
            disabled={!user}
            onChange={(e) =>
              setUser((prev) => ({
                ...prev!,
                address: { ...prev!.address, homeAddress: e.target.value },
              }))
            }
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 h-30"
          />
        </div>
        <div className="h-50 bg-gray-5 w-0.5 mr-4 hidden md:block" />
        <div className="md:w-96">
          <div className="p-4 border-b">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>
                <b>{total}</b>
                {" Dzd"}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping</span>
              <span>
                <b>Free</b>
              </span>
            </p>
          </div>
          <div className="p-4 border-b">
            <p className="flex justify-between">
              <span>Total</span>
              <span>
                <b>{total} </b> {" Dzd"}
              </span>
            </p>
          </div>
          <div className="p-4">
            <button
              className="w-full bg-[#1c274c] hover:bg-[#36467a] duration-200 text-white p-2 rounded-lg flex gap-2 justify-center items-center"
              onClick={HandleConfirmOrder}
            >
              {loading ? (
                <MoonLoader size={19} color="white " />
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSummary;
