import React, { useContext, useEffect, useState } from "react";
import { Hospital, NetworkIcon, SaveIcon } from "lucide-react";
import { NestedDropdown } from "mui-nested-menu";

import { FaRegHospital } from "react-icons/fa6";
import { FaHospitalAlt } from "react-icons/fa";
import { SharedContext } from "../context/SharedContext";
import { SidebarContext } from "../SidebarContext";

export function NewMenuBar({ speciality, rating }) {
  const api = localStorage.getItem("API");
  const mail = localStorage.getItem("mail");
  const loginBranch = localStorage.getItem("Branch");
  const Cluster = localStorage.getItem("Cluster");

  const [selectedItem, setSelectedItem] = useState(() =>
    mail === "manipal@gmail.com"
      ? "Locations"
      : loginBranch === "undefined"
        ? Cluster
        : loginBranch
  );


  // Use context directly without destructuring
  const { setcontextHospitals, setLocationProfiles } = useContext(SharedContext);
  const { setDrNameContext, setSpecialityContext } = useContext(SidebarContext);
  useEffect(() => {
    speciality = "";
    setSpecialityContext("");
  }, [selectedItem])

  // Handler function to manage item clicks
  const handleItemClick = (event, item) => {
    setSelectedItem(item.label); // Update state with the clicked item's label
    if (item.label === "All") {
      window.location.reload();
    }
    //console.log(`${item.label} clicked`, event, item);
    setcontextHospitals(item.label); // Set the selected item in context
  };

  // useEffect(() => {
  // This function will run whenever `selectedItem` changes

  useEffect(() => {
    async function filterApi(city) {
      try {
        let sendCity = city === "Locations" ? "" : city;
        let sendState = "";

        if (city === "undefined") {
          sendState = Cluster;
        }

        let spcialitytoSend = speciality ? speciality : "";

        let ratingtoSend = rating ? rating : "";

        const response = await fetch(`${api}/getfilterdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: sendState, branch: sendCity, speciality: spcialitytoSend, rating: ratingtoSend }),
        });

        const data = await response.json();
        setLocationProfiles(data.countOfProfiles);
        if (data.result?.length > 0) {
          setDrNameContext(data.result[0].businessNames);
        } else {
          setDrNameContext([]); // Important: Clear the names if nothing returned
        }
        if (data.result[0].specialities) {
          setSpecialityContext(data.result[0].specialities);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (selectedItem) {
      filterApi(selectedItem); // Ensures the function runs when selectedItem is set
    }

  }, [selectedItem, mail, loginBranch, setLocationProfiles, speciality, rating]);

  // Run on component mount

  useEffect(() => {
    const handlePageRefresh = () => {
      setLocationProfiles("");
    };
    window.addEventListener("beforeunload", handlePageRefresh);
  });

  const menuItemsData = {
    label: selectedItem,
    leftIcon: <SaveIcon className="text-blue-500" />,
    items: mail === "manipal@gmail.com" ? [
      {
        label: "All",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        callback: handleItemClick, // Use the handler for clicks
      },
      {
        label: "South",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [
          {
            label: "Begur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Doddaballapur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Hebbal",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "MHB",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Sarjapur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Jayanagar",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Varthur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Malleshwaram",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Whitefield",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Millers Road",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Yeshwanthpur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Salem",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Mysore",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Brookefield",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Budigere",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },
      {
        label: "North West",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        callback: handleItemClick,
        items: [
          {
            label: "Delhi - NCR",
            leftIcon: <FaHospitalAlt className="text-indigo-500" />,
            items: [
              {
                label: "Delhi",
                leftIcon: <FaRegHospital className="text-green-500" />,
                callback: handleItemClick,
              },
              {
                label: "Ghaziabad",
                leftIcon: <FaRegHospital className="text-green-500" />,
                callback: handleItemClick,
              },
              {
                label: "Gurugram",
                leftIcon: <FaRegHospital className="text-green-500" />,
                callback: handleItemClick,
              },
            ],
          },
          {
            label: "Pune",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick,
          },
          {
            label: "Jaipur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick,
          },
          {
            label: "Patiala",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick,
          },
          {
            label: "Baner",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick,
          },
        ],
      },
      {
        label: "Goa-Mangalore",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [
          {
            label: "Goa",
            callback: handleItemClick,
          },
          {
            label: "Mangalore",
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },
      {
        label: "South East",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [
          {
            label: "BBR",
            callback: handleItemClick,
          },
          {
            label: "Vijayawada",
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },
      {
        label: "International",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [
          {
            label: "Bangladesh",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick,
          },
          {
            label: "Burundi",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Kenya",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Malawi",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Mauritius",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Rwanda",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Uganda",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },
      {
        label: "VC Doctor",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [

          {
            label: "Varthur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },
      {
        label: "East",
        leftIcon: <FaHospitalAlt className="text-indigo-500" />,
        items: [
          {
            label: "Broad way",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Dhakuria",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Mukundapur",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
          {
            label: "Salt lake",
            leftIcon: <FaRegHospital className="text-green-500" />,
            callback: handleItemClick, // Use the handler for clicks
          },
        ],
      },

      //   {
      //     label: "Hospitals",
      //     leftIcon: <FaHospitalAlt className="text-indigo-500" />,
      //     items: [
      //       {
      //         label: "Delhi",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Ghaziabad",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: 'Palamvihar',
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Jaipur",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Patiala",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Pune",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks,
      //       },
      //       {
      //         label: "Baner",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Goa",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Mangalore",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick,
      //       },
      //       {
      //         label: "Doddaballapur",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Old Airport Road",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Sarjapur",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Jayanagar",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Varthur",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Malleshwaram",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Whitefield",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Millers Road",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Yeshwanthpur",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Salem",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Mysore",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Vijayawada",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //       {
      //         label: "Hospitals",
      //         leftIcon: <FaRegHospital className="text-green-500" />,
      //         callback: handleItemClick, // Use the handler for clicks
      //       },
      //     ],
      //   },
    ] : [],
  };

  return (
    <div
      className="bg-purple-500 hover:bg-purple-400"
      style={{
        backgroundColor: "#A19EC9",
        borderRadius: "10px",
        marginTop: "3%",
      }}
    >
      <NestedDropdown
        placeholder="Hospital"
        menuItemsData={menuItemsData}
        MenuProps={{ elevation: 3, className: "rounded-2xl shadow-lg" }}
        ButtonProps={{
          variant: "outlined",
          className:
            "text-white bg-slate-400 hover:bg-purple-400 rounded-2xl px-4 ",
          style: { borderRadius: "10px", height: "35px" },
        }}
        onClick={() => console.log("Clicked")}
      />
    </div>
  );
}
