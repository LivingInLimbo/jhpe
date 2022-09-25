import { useState, useEffect, FormEvent } from "react";
import { useQuery, gql } from "@apollo/client";
import { optionsNoAuth } from "../..";
import { useErrorHandler } from "react-error-boundary";
import { Spinner } from "../app/Spinner";
import { LabledTextInput } from "../forms/LabledTextInput";
import { LabledSelect } from "../forms/LabledSelect";
import { ColorButton } from "../forms/ColorButton";
import { IoAdd } from "react-icons/io5";

export const CreateListingComponent = () => {
  const GET_CATEGORIES = gql`
    query getCategories {
      categories {
        id
        name
        urlName
        subcategory {
          id
          name
          urlName
        }
      }
    }
  `;

  type Category = {
    id: Number;
    name: String;
    urlName: String;
    subcategory: SubCategory[];
  };

  type SubCategory = {
    id: Number;
    name: String;
    urlName: String;
  };

  let subcategories: SubCategory[] = [];

  const categoryQuery = useQuery(GET_CATEGORIES);
  useErrorHandler(categoryQuery.error);
  if (categoryQuery.data) {
    console.log(categoryQuery.data);
    subcategories = categoryQuery.data.categories[0].subcategory;
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const onCategoryChange = (e: any) => {
    const value = parseInt(e.target.value);
    const selectedCategory = categoryQuery.data.categories.find(
      (category: Category) => category.id === value
    );
    if (selectedCategory) {
      subcategories = selectedCategory.subcategory;
    }
  };

  const [imgSrcs, setImgSrcs] = useState<string[]>([]);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);
      const fileRegex = new RegExp("image/*");
      const image = fileRegex.test(e.target.files[0].type);
      // check if file is indeed an image
      if (!image) {
        setErrorMessage(
          "File is not an image! Accepted formats: jpg, jpeg, png, webp"
        );
        return;
      } else if (e.target.files[0].size > 5000000) {
        setErrorMessage("File is too big! (Max. file size 5MB)");
        return;
      } else {
        setErrorMessage("");

        const handleFileChosen = async (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
              resolve(fileReader.result?.toString() || "");
            };
            fileReader.onerror = reject;
            fileReader.readAsDataURL(file);
          });
        };

        const results: string[] = await Promise.all(
          Array.from(e.target.files).map(async (file: File) => {
            const fileContents = await handleFileChosen(file);
            return fileContents;
          })
        );

        setImgSrcs(results);
      }
    }
  };

  useEffect(() => {
    console.log(imgSrcs);
  }, [imgSrcs]);

  const formFieldClass = "w-full mb-4";
  const [test, setTest] = useState("lmfao");

  return categoryQuery.loading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full mb-4">
        <div className="text-4xl text-center font-bold mb-12">New Listing</div>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {imgSrcs.map((imgSrc: string) => (
            <img
              key={imgSrc}
              className="w-32 h-32 object-contain border rounded-md"
              src={imgSrc}
            ></img>
          ))}
          <div className="w-32 h-32 border border-gray-500 rounded-md">
            <label className="w-full h-full rounded-md cursor-pointer">
              <input
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={onSelectFile}
              />
              <div className="w-full h-full flex items-center justify-center">
                <IoAdd className="" size={26} />
              </div>
            </label>
          </div>
        </div>

        <form className="flex flex-col" onSubmit={submitForm}>
          <LabledTextInput
            className={formFieldClass}
            label="Name"
            placeholder="Name"
            onChange={onNameChange}
            value={name}
          />
          <LabledTextInput
            className={formFieldClass}
            label="Description"
            placeholder="Description"
            onChange={onDescriptionChange}
            value={description}
          />
          <LabledSelect
            className={formFieldClass}
            onChange={onCategoryChange}
            list={categoryQuery.data.categories}
            nameId="name"
            valueId="id"
            label="Category"
          />
          <LabledSelect
            className={formFieldClass}
            list={subcategories}
            nameId="name"
            valueId="id"
            label="Sub Category"
          />
        </form>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="text-4xl text-center font-bold mb-12">Preview</div>
      </div>
    </div>
  );
};
