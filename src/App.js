import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { trackPromise } from 'react-promise-tracker';
import './App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '120ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
    fontSize: 20
  },
  primary:{
    fontSize: 30
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "red",
    margin:10
  },
  search: {
    width: '36ch'
  }
}));

function App() {
  const classes = useStyles();
  const [brands, setBrands] = useState(null);
  const[search, setSearch] = useState('');

  const searchSpace=(event)=>{
    let keyword = event.target.value;
    setSearch(keyword)
  }

  const fetchData = async () => {
    const response = await trackPromise(axios.get(
      'https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json'
    ));
    
    const responseImage = await axios.get(
      'https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json'
    );

    const imageData = responseImage.data;

    const data = response.data;

    var j = 0;
    for(let i=0; i<data.length; i++){
      if(j===imageData.length -1){
        j = 0
        data[i].image = imageData[j]
      }
      else{
        data[i].image = imageData[j]
        j++;
      }
    }
    setBrands(data);
  };

  return (
    <div className="App">
      <h1>Beer Brands</h1>
      <h2>Fetch the list of beer brands </h2>

      {/* Fetch data from API */}
      <div>
        <button className="fetch-button" onClick={fetchData}>
          Fetch the List !
        </button>
        <br />
      </div>

      {/* Display data from API */}
      <div className="books">
        <div className={classes.search}>
          <TextField id="outlined-basic" label="Search By Name" variant="outlined" onChange={(e)=>searchSpace(e)} />
        </div>
      <List className={classes.root}>
        {brands &&
          brands.filter((data) => {
            if(search === ''){
              return data
            }
            else if(data.name.toLowerCase().includes(search.toLowerCase())){
              return data
            }
          }).map((brand, index) => {
            if(brand.ibu === ""){
              return (
                <div className="beer brand" key={index}>
                  <ListItem >
                    <img src={brand.image.image} alt="Beer_Image" className={classes.image} />
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.primary}
                          >
                            {brand.name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textSecondary"
                          >
                          
                          ID: {brand.id}  Style: {brand.style} Ounces: {brand.ounces}  abv:{brand.abv}  ibu: None
                        </Typography>
                        </React.Fragment>
                        }
                    />
                    
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            }
            else{
              return (
                <div className="beer brand" key={index}>
                  <ListItem >
                    <img src={brand.image.image} alt="Beer_Image" className={classes.image} />
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.primary}
                          >
                            {brand.name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textSecondary"
                          >
                          
                          ID: {brand.id}  Style: {brand.style} Ounces: {brand.ounces}  abv:{brand.abv}  ibu:{brand.ibu}
                        </Typography>
                        </React.Fragment>
                        }
                    />
                    
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              );
            }
          })}
          </List> 
      </div>
    </div>
  );
}

export default App;
