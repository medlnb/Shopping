"use client";
import AlgerianCities from "@data/AlgerianCities";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { ClipLoader, MoonLoader } from "react-spinners";
import { toast } from "sonner";

interface User {
  name: string;
  phoneNumber: string;
  image: string;
  address: {
    state: number;
    city: number;
    homeAddress: string;
  };
}

function Page() {
  const t = useTranslations("myacc");
  const { update } = useSession();
  const [user, setUser] = useState<User>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSubmitImage, setLoadingSubmitImage] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return toast.error("Error fetching user data");
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

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const res = await fetch("/api/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });

    if (!res.ok) {
      toast.error("Error updating user data");
      setLoadingSubmit(false);
      return;
    }
    update({
      name: user?.name,
      phoneNumber: user?.phoneNumber,
      image: user?.image,
    });

    toast.success(t("UpdateSuccess"));
    setLoadingSubmit(false);
  };

  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    if (!file) return Promise.reject(t("noImage"));
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const HandleChangeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingSubmitImage(true);
    const file = event.target.files?.[0];
    if (!file) {
      setLoadingSubmitImage(false);
      return toast.error(t("noImage"));
    }
    const UploadedImage = (await convertToBase64(file)) as string;

    const res = await fetch(`/api/image`, {
      method: "POST",
      body: JSON.stringify({ image: UploadedImage }),
    });
    const { imageId } = await res.json();
    await fetch("/api/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: `https://shopping-hamma.vercel.app/api/image/${imageId}`,
      }),
    });
    setUser((prev) => ({
      ...prev!,
      image: `https://shopping-hamma.vercel.app/api/image/${imageId}`,
    }));
    update({
      image: `https://shopping-hamma.vercel.app/api/image/${imageId}`,
    });

    setLoadingSubmitImage(false);
  };

  return (
    <form onSubmit={HandleSubmit}>
      <div className="shadow-1 rounded-xl p-4 sm:p-8.5 relative ">
        {user ? (
          <div className="mb-6 h-40 w-40 rounded-full mx-auto flex items-center justify-center bg-gray-4">
            <label htmlFor={"image-upload"} className="cursor-pointer ">
              {loadingSubmitImage ? (
                <MoonLoader size={50} color="blue" />
              ) : (
                <div className="relative">
                  <Image
                    height={400}
                    width={400}
                    src={user.image}
                    alt={user.name}
                    className="h-40 w-40 rounded-full mx-auto object-contain"
                  />
                  <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gray-1 hover:opacity-50 opacity-0 duration-150 w-full h-full rounded-full" />
                  <div className="absolute right-0 bottom-0">
                    <FaRegEdit className="text-4xl text-gray-7" />
                  </div>
                </div>
              )}
            </label>
            <input
              className="h-full w-full hidden"
              type="file"
              name={"image-upload"}
              id={"image-upload"}
              accept=".jpeg, .png, .jpg"
              onChange={HandleChangeImage}
            />
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full mx-auto mb-6 loading--background" />
        )}
        {!user && (
          <div className="absolute top-5 right-5">
            <ClipLoader size={20} />
          </div>
        )}
        <div className="w-full mb-5">
          <label htmlFor="name" className="block mb-2.5">
            {t("name")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="name"
            id="name"
            placeholder="Mohamed Ben____"
            value={user?.name ?? ""}
            disabled={!user}
            onChange={(e) =>
              setUser((prev) => ({ ...prev!, name: e.target.value }))
            }
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <label htmlFor="name" className="block mb-2.5">
          {t("phoneNumber")} <span className="text-red">*</span>
        </label>
        <div
          className={`mb-5 flex items-center rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 `}
        >
          <Image
            height={20}
            width={20}
            src="https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg"
            alt="Algeria Flag"
            className="w-6 h-4 mr-2"
          />
          <p>0</p>
          <input
            id="phoneNumber"
            type="number"
            className="focus:outline-none bg-gray-1 flex-1"
            value={user?.phoneNumber ? Number(user?.phoneNumber) : ""}
            disabled={!user}
            onChange={(e) =>
              setUser((prev) => ({ ...prev!, phoneNumber: e.target.value }))
            }
          />
        </div>
        <div className="mb-5">
          <label htmlFor="state" className="block mb-2.5">
            {t("state")} <span className="text-red">*</span>
          </label>

          <div className="relative">
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

          <label htmlFor="city" className="block mb-2.5 mt-5">
            {t("city")} <span className="text-red">*</span>
          </label>
          <div className="relative">
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
        </div>
        <div className="w-full my-4">
          <label htmlFor="Homeaddress" className="block mb-2.5">
            {t("homeAddress")} <span className="text-red">*</span>
          </label>

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
        <button
          type="submit"
          className="w-40 inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ClipLoader size={23} className="mx-auto" color="white" />
          ) : (
            t("save")
          )}
        </button>
      </div>

      <p className="text-custom-sm mt-5 px-4 mb-9">{t("desc")}</p>
    </form>
  );
}

export default Page;
