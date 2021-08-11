  
import React from 'react';
import { Grid } from '@material-ui/core';
import HighlightCard from './HighlightCard.js';

export default function Highlight({ summary }) {
  // console.log("summary" + JSON.stringify(summary))
  return (
    <Grid container spacing={3}>
      {summary.map((data, index) => (
        <Grid item sm={4} xs={12} key={index}>
          <HighlightCard key={index}
            title={data.title}
            count={data.count}
            type={data.type}
          />
        </Grid>
      ))}
    </Grid>
  );
}