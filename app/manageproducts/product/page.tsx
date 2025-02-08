"use client";
import ImagePost from "@components/ImagePost";
import Sele from "@components/Select";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { GoStarFill, GoStar } from "react-icons/go";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import Categories from "@data/categories";
import Select from "@mui/joy/Select";
import Option, { optionClasses } from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListItemDecorator, {
  listItemDecoratorClasses,
} from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import { Check } from "@mui/icons-material";
import ListManager from "@components/ListManager";
import Loader from "@components/Loader";

interface Product {
  title: string;
  description: string;
  variances: {
    price: number;
    newPrice: number;
    quantity: number;
    unit: string;
    stock: number;
    info: string;
  }[];
  category: {
    aisle: string;
    subcategories: string;
    item?: string;
  };
  ingedients: string[];
  brand: string;
  images: { image: string; id: string }[];
}

const defaultInput = {
  title: "",
  description: "",
  variances: [],
  category: {
    aisle: "Makeup",
    subcategories: "",
  },
  ingedients: [],
  brand: "",
  images: [],
};

function Page({ searchParams: { id } }: { searchParams: { id?: string } }) {
  const [input, setInput] = useState<Product>(defaultInput);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const [variances, setVariances] = useState({
    price: 0,
    quantity: 0,
    unit: "L",
    stock: 0,
    newPrice: 0,
    info: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (!res.ok) return toast.error(data.err);
      setLoading(false);

      setInput({
        ...data.product,
        images: data.product.images.map((img: string) => ({
          image: "",
          id: img,
        })),
      });
    };
    if (id) fetchProduct();
    else setInput(defaultInput);
  }, [id]);

  const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !input.title ||
      !input.description ||
      !input.brand ||
      !input.category.aisle ||
      !input.category.subcategories ||
      !input.variances.length
    )
      return toast.error("Please fill all the required fields *");

    setLoadingSubmit(true);

    const res = await fetch("/api/admin/product", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        id,
        images: input.images.map((img) => img.id),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setLoadingSubmit(false);
    if (!res.ok) return toast.error(data.err);
    if (!id) setInput(defaultInput);
    toast.success(data.msg);
  };

  const HandleAddVariance = () => {
    if (variances.price === 0 || variances.quantity === 0) return;
    if (
      input.variances.find(
        (sub) =>
          sub.quantity === variances.quantity &&
          sub.price === variances.price &&
          sub.unit === variances.unit &&
          sub.info === variances.info
      )
    )
      return toast.warning("This variance already exists");

    setInput((prev) => ({
      ...prev!,
      variances: [...prev!.variances, variances],
    }));
    setVariances((prev) => ({
      quantity: 0,
      price: 0,
      unit: prev.unit,
      stock: 0,
      info: "",
      newPrice: 0,
    }));
  };

  if (loading) return <Loader title="Getting your Product..." />;

  return (
    <form className="max-w-[73rem] mx-auto" onSubmit={HandleSubmit}>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        <div>
          <h3 className="text-gray-500 font-semibold mb-2 text-lg">
            Title <span className="text-sm text-gray-500">*</span>
          </h3>
          <input
            value={input.title}
            onChange={(e) =>
              setInput((prev) => ({ ...prev!, title: e.target.value }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="Title..."
          />
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold mb-2 text-lg">Brand</h3>
          <input
            value={input.brand}
            onChange={(e) =>
              setInput((prev) => ({ ...prev!, brand: e.target.value }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="Brand..."
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-gray-500 font-semibold mb-2 text-lg">
            Describtion
          </h3>
          <textarea
            value={input.description}
            onChange={(e) =>
              setInput((prev) => ({
                ...prev!,
                description: e.target.value,
              }))
            }
            className="border bg-gray-100 text-sm  border-gray-300 focus:outline-none w-full p-2 rounded-md h-36"
            placeholder="Description..."
          />
        </div>
      </section>

      <h3 className="text-gray-500 font-semibold mb-2 text-lg">
        Catigory <span className="text-sm text-gray-500">*</span>
      </h3>

      <Sele
        borderColor="border-green-600"
        selectedBorderColor="border-gray-500"
        labelslist={Categories.map((cat) => ({
          label: cat.aisle,
          key: cat.aisle,
        }))}
        onChangeHere={(item) =>
          setInput((prev) => ({
            ...prev!,
            category: {
              aisle: item,
              subcategories: "",
              item: "",
            },
          }))
        }
        value={input.category.aisle}
        multi
      />

      <Select
        placeholder="More Infroamtion..."
        className="mt-4"
        value={`${input.category.subcategories}${
          input.category.item ? "$#$" + input.category.item : ""
        }`}
        onChange={(
          event: React.SyntheticEvent | null,
          newValue: string | null
        ) => {
          if (!newValue || !event) return;
          setInput((prev) => ({
            ...prev!,
            category: {
              ...prev.category,
              subcategories: newValue.split("$#$")[0],
              item: newValue.split("$#$")[1],
            },
          }));
        }}
        slotProps={{
          listbox: {
            component: "div",
            sx: {
              width: "100%",
              overflow: "auto",
              "--List-padding": "0px",
              "--ListItem-radius": "0px",
            },
          },
        }}
        sx={{ width: "100%" }}
      >
        {Categories.filter(
          (cat) => cat.aisle === input.category.aisle
        )[0].subcategories.map((element, index) => (
          <Fragment key={element.title}>
            {index !== 0 && <ListDivider role="none" />}
            <List
              aria-labelledby={`select-group-${element.title}`}
              sx={{ "--ListItemDecorator-size": "28px" }}
            >
              <ListItem id={`select-group-${element.title}`} sticky>
                <Typography level="body-xs" sx={{ textTransform: "uppercase" }}>
                  {element.title} (
                  {element.items.length === 0 ? "1" : element.items.length})
                </Typography>
              </ListItem>
              {!element.items.length && (
                <Option
                  key={element.title}
                  value={element.title}
                  label={
                    <Fragment>
                      <Chip size="sm" sx={{ borderRadius: "xs", mr: 1 }}>
                        {element.title}
                      </Chip>{" "}
                      {element.title}
                    </Fragment>
                  }
                  sx={{
                    [`&.${optionClasses.selected} .${listItemDecoratorClasses.root}`]:
                      {
                        opacity: 1,
                      },
                  }}
                >
                  <ListItemDecorator sx={{ opacity: 0 }}>
                    <Check />
                  </ListItemDecorator>
                  <Typography component="span" level="title-sm">
                    {element.title}
                  </Typography>
                </Option>
              )}
              {element.items.map((anim) => (
                <Option
                  key={anim}
                  value={anim + "$#$" + element.title}
                  label={
                    <Fragment>
                      <Chip size="sm" sx={{ borderRadius: "xs", mr: 1 }}>
                        {element.title}
                      </Chip>{" "}
                      {anim}
                    </Fragment>
                  }
                  sx={{
                    [`&.${optionClasses.selected} .${listItemDecoratorClasses.root}`]:
                      {
                        opacity: 1,
                      },
                  }}
                >
                  <ListItemDecorator sx={{ opacity: 0 }}>
                    <Check />
                  </ListItemDecorator>
                  <Typography component="span" level="title-sm">
                    {anim}
                  </Typography>
                </Option>
              ))}
            </List>
          </Fragment>
        ))}
      </Select>

      <ListManager
        title="Ingredients"
        HandlingAdd={(item) =>
          setInput((prev) => ({
            ...prev!,
            ingedients: [...prev.ingedients, item],
          }))
        }
        HandlingRemove={(item) =>
          setInput((prev) => ({
            ...prev!,
            ingedients: prev.ingedients.filter((sub) => sub !== item),
          }))
        }
        list={input.ingedients}
      />

      <h3 className="text-gray-500 font-semibold mb-2 text-lg">
        {"Add the product's prices"}
        <span className="text-sm text-gray-500">*</span>
      </h3>
      <div className="grid grid-cols-3 md:gap-1 gap-0.5 gap-y-2 items-center mb-4">
        <div>
          <h3 className="text-gray-500 font-semibold mb-1">
            Price <span className="text-sm text-gray-500">*</span>
          </h3>
          <input
            value={variances.price === 0 ? "" : variances.price}
            onChange={(e) =>
              setVariances((prev) => ({
                ...prev,
                price: Number(e.target.value) || 0,
              }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="100.00 Dzd"
          />
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold mb-1">New Price</h3>
          <input
            value={variances.newPrice === 0 ? "" : variances.newPrice}
            onChange={(e) =>
              setVariances((prev) => ({
                ...prev,
                newPrice: Number(e.target.value) || 0,
              }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="100.00 Dzd"
          />
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold mb-1">Discount %</h3>
          {(() => {
            const t = (1 - variances.newPrice / variances.price) * -100;
            const persontage =
              !variances.price || !variances.newPrice
                ? "/"
                : t.toFixed(0) + "%";
            return (
              <p className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md text-center">
                {persontage}
              </p>
            );
          })()}
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold mb-1">
            Stock<span className="text-sm text-gray-500">*</span>
          </h3>
          <input
            value={variances.stock === 0 ? "" : variances.stock}
            onChange={(e) =>
              setVariances((prev) => ({
                ...prev,
                stock: Number(e.target.value) || 0,
              }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="100"
          />
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold mb-1">
            Quantity <span className="text-sm text-gray-500">*</span>
          </h3>
          <div className="flex justify-between border bg-gray-100 border-gray-300 rounded-md p-2">
            <input
              value={variances.quantity === 0 ? "" : variances.quantity}
              onChange={(e) =>
                setVariances((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value) || 0,
                }))
              }
              className="focus:outline-none bg-transparent w-16 md:w-28"
              placeholder="10"
              type="number"
            />
            <select
              value={variances.unit}
              onChange={(e) =>
                setVariances((prev) => ({ ...prev, unit: e.target.value }))
              }
              className="focus:outline-none bg-transparent w-8"
            >
              <option value="L">L</option>
              <option value="Kg">Kg</option>
            </select>
          </div>
        </div>
        <div className="col-span-3">
          <h3 className="text-gray-500 font-semibold mb-1">
            Extra Information
          </h3>
          <input
            value={variances.info}
            onChange={(e) =>
              setVariances((prev) => ({
                ...prev,
                info: e.target.value,
              }))
            }
            className="border bg-gray-100  border-gray-300 focus:outline-none w-full p-2 rounded-md"
            placeholder="Blue color model..."
          />
        </div>

        <button
          type="button"
          onClick={HandleAddVariance}
          className="col-start-3 bg-gray-6 text-white p-1 mt-1 rounded-md w-full hover:bg-gray-5 duration-150"
        >
          Add
        </button>
      </div>

      {input.variances.map((varn, index) => (
        <div
          key={index}
          className="grid grid-cols-4 md:gap-2 gap-0.5 items-center pb-2 mb-2 border-b"
        >
          <div className="flex items-center justify-center gap-1">
            {!index ? (
              <GoStarFill />
            ) : (
              <GoStar
                className="p-1 cursor-pointer hover:scale-110 duration-150"
                onClick={() =>
                  setInput((prev) => ({
                    ...prev,
                    variances: [
                      varn,
                      ...prev.variances.filter(
                        (ele) =>
                          !(
                            ele.price === varn.price &&
                            ele.quantity === varn.quantity
                          )
                      ),
                    ],
                  }))
                }
                size={23}
              />
            )}
            <FaTrash
              onClick={() =>
                setInput((prev) => ({
                  ...prev!,
                  variances: prev!.variances.filter(
                    (subsub) =>
                      subsub.quantity !== varn.quantity ||
                      subsub.price !== varn.price
                  ),
                }))
              }
              size={23}
              className="p-1 cursor-pointer hover:scale-110 duration-150"
            />
          </div>
          <p className="flex-1 overflow-auto hidden-scrollbar focus:outline-none border border-black rounded-md md:px-2 px-1 text-center">
            {varn.price} Dzd
          </p>
          <p className="flex-1 overflow-auto hidden-scrollbar focus:outline-none border border-black rounded-md md:px-2 px-1 text-center">
            {varn.newPrice ? varn.newPrice + " Dzd" : "/"}
          </p>
          <p className="overflow-auto hidden-scrollbar focus:outline-none border border-black rounded-md md:px-2 px-1 text-center">
            {varn.stock}
          </p>

          <div className="overflow-auto hidden-scrollbar flex items-center justify-center gap-1 border border-black rounded-md md:px-2 px-1">
            <p>{varn.quantity}</p>
            <p> {varn.unit}</p>
          </div>
          <div className="col-span-3 flex">
            <p className="flex-1 overflow-auto hidden-scrollbar focus:outline-none border border-black rounded-md md:px-2 px-1">
              {varn.info}
            </p>
          </div>
        </div>
      ))}
      <h3 className="text-gray-500 text-lg font-semibold mb-2 mt-5">
        Add Some of your {"product's"} images
        <span className="text-sm text-gray-500"> *</span>
      </h3>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <ImagePost
          HandleIsDone={(image, id) =>
            setInput((prev) => ({
              ...prev!,
              images: [...prev.images, { image, id }],
            }))
          }
        />
        {input.images.map((pic, index) => (
          <ImagePost
            key={pic.id}
            isMain={index === 0}
            image={pic}
            HandleIsDone={(image, id) => {
              setInput((prev) => ({
                ...prev!,
                images: prev.images.map((img) =>
                  img.id === id ? { image, id } : img
                ),
              }));
            }}
            HandleIsRemoved={(id) => {
              setInput((prev) => ({
                ...prev!,
                images: prev.images.filter((img) => img.id !== id),
              }));
            }}
            HandleMakeFirst={(img) => {
              setInput((prev) => ({
                ...prev!,
                images: [
                  img,
                  ...prev.images.filter((sub) => sub.id !== img.id),
                ],
              }));
            }}
          />
        ))}
      </section>

      <button
        type="submit"
        className="bg-[#1c274c] hover:bg-[#2a3968]  text-white p-2 rounded-md w-full mt-4 duration-150 flex items-center gap-2 justify-center"
        disabled={loadingSubmit}
      >
        {id ? "Update" : "Post"}
        {loadingSubmit && <ClipLoader color="white" size={20} />}
      </button>
    </form>
  );
}

export default Page;
