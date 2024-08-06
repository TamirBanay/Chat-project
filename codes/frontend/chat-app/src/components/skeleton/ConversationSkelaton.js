import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

const variants = ["h3"];

function TypographyDemo(props) {
  return (
    <div
      className="skel"
      style={{
        width: "340px",
        display: "flex",
        height: "25%",
      }}
    >
      {variants.map((variant) => (
        <Typography component="div" key={variant} variant={variant}>
          <Skeleton sx={{ borderRadius: "17px", width: "340px" }} />
        </Typography>
      ))}
    </div>
  );
}

export default function SkeletonTypography() {
  const itemsArray = new Array(5).fill(null);

  return (
    // <Grid container spacing={8}>
    //   <Grid item xs>
    <div>
      {itemsArray.map((_, index) => (
        <TypographyDemo loading key={index} />
      ))}
    </div>
    //   </Grid>
    // </Grid>
  );
}
