import {Filter1Rounded} from "@material-ui/icons";
import {Divider} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Slider from "@mui/material/Slider";
import {useContext, useEffect, useState} from "react";

import {AppContext} from "../../App/App";
import {DASHBOARD_ACTIONS} from "../../shared/immutables";
import {Filter} from "../../shared/models";
import styles from "./FilterDrawer.module.scss";

const enum CheckBoxType {
  LANG = "language",
  CATEGORY = "category",
}

function FilterDrawer({open, handleClose, dispatchFilterAction}) {
  const [priceCheckbox, setPriceCheckbox] = useState(false);
  const [price, setPrice] = useState<number[]>([0, 1000]);
  const [lang, setLang] = useState([]);
  const [categories, setCategories] = useState([]);
  const [langCheckedState, setLangCheckedState] = useState([]);
  const [categoryCheckedState, setCategoryCheckedState] = useState([]);

  const {appState} = useContext(AppContext);

  useEffect(() => {
    const langSet = new Set();
    const categorySet = new Set();
    appState.books?.forEach((book) => {
      langSet.add(book.language);
      categorySet.add(book.category);
    });
    setLang(Array.from(langSet));
    setCategories(Array.from(categorySet));
  }, [appState.books]);

  useEffect(() => {
    setLangCheckedState(new Array(lang.length).fill(false));
  }, [lang]);

  useEffect(() => {
    setCategoryCheckedState(new Array(categories.length).fill(false));
  }, [categories]);

  const MAX_PRICE_VALUE = 10000;
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPrice(newValue as number[]);
  };

  const handleCheckboxChange = (position, type: CheckBoxType) => {
    const isLangChanged = type === CheckBoxType.LANG;
    const stateMap = isLangChanged ? langCheckedState : categoryCheckedState;
    const updatedCheckedState = stateMap.map((item, index) =>
      index === position ? !item : item
    );

    isLangChanged
      ? setLangCheckedState(updatedCheckedState)
      : setCategoryCheckedState(updatedCheckedState);
  };

  const applyFilterAction = () => {
    const languages = [];
    langCheckedState.forEach((state, index) => {
      if (!!state) {
        languages.push(lang[index]);
      }
    });
    const category = [];
    categoryCheckedState.forEach((state, index) => {
      if (!!state) {
        category.push(categories[index]);
      }
    });
    const filter = new Filter();
    if (priceCheckbox) {
      filter.price = {
        min: price[0],
        max: price[1],
      };
    }
    filter.language = languages.length ? [...languages] : null;
    filter.category = category.length ? [...category] : null;

    dispatchFilterAction({
      type: DASHBOARD_ACTIONS.APPLY_FILTER,
      data: filter,
    });
    handleClose();
  };

  const clearFilterAction = () => {
    dispatchFilterAction({
      type: DASHBOARD_ACTIONS.CLEAR_FILTER,
    });
    handleClose();
  };

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      handleClose(state);
    };

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box sx={{width: 300}} role="filter" className={styles.container}>
        <div className={styles.heading}>LANGUAGE</div>
        <FormGroup>
          {lang.length &&
            lang.map((language, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={langCheckedState[index]}
                    onChange={() =>
                      handleCheckboxChange(index, CheckBoxType.LANG)
                    }
                  />
                }
                label={language}
              />
            ))}
        </FormGroup>
        <Divider />
        <div className={styles.heading}>CATEGORY</div>
        <FormGroup>
          {categories.length &&
            categories.map((category, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={categoryCheckedState[index]}
                    onChange={() =>
                      handleCheckboxChange(index, CheckBoxType.CATEGORY)
                    }
                  />
                }
                label={category}
              />
            ))}
        </FormGroup>
        <Divider />
        <FormControlLabel
          control={
            <Checkbox
              checked={priceCheckbox}
              onChange={() => setPriceCheckbox(!priceCheckbox)}
            />
          }
          className={styles.heading}
          label="PRICE"
        />
        <Slider
          max={MAX_PRICE_VALUE}
          value={price}
          className={styles.priceSlider}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          disabled={!priceCheckbox}
        />
        {priceCheckbox && (
          <>
            <div>MIN: {price[0]}</div>
            <div>MAX: {price[1]}</div>
          </>
        )}
        <Button variant="contained" onClick={applyFilterAction}>
          Apply Filter
        </Button>
        <Button variant="outlined" onClick={clearFilterAction}>
          Clear Filter
        </Button>
      </Box>
    </Drawer>
  );
}

export default FilterDrawer;
