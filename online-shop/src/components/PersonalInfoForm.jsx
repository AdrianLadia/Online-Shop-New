import React from "react";
import AppContext from "../AppContext";
import { useContext } from "react";
import { Typography } from "@mui/material";

const PersonalInfoForm = () => {
  const {
    userdata
   } = useContext(AppContext);

  return (
    <div>
      {userdata ? (
        <div className="flex flex-col bg-gradient-to-r from-colorbackground via-color2 to-color1">
          <Typography variant="h1" className="text-center my-8">
            Hello {userdata.name}
          </Typography>
        </div>
      ) : (
        <>Loading Data</>
      )}
    </div>
  );
};

export default PersonalInfoForm;
