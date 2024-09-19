import { Document } from "mongoose";

/* E N U M S */

// FOR FUTURE

/* export enum CountryStats {
  YEAR_2004 = "2004",
  YEAR_2005 = "2005",
  YEAR_2006 = "2006",
  YEAR_2007 = "2007",
  YEAR_2007_TOR = "2007_TOR",
  YEAR_2008 = "2008",
  YEAR_2009 = "2009",
  YEAR_2009_EMU = "2009_EMU",
  YEAR_2010 = "2010",
  YEAR_2011 = "2011",
  YEAR_2012 = "2012",
  YEAR_2012_10Y = "2012_10Y",
  YEAR_2013 = "2013",
  YEAR_2014 = "2014",
  YEAR_2015 = "2015",
  YEAR_2015_30YF = "2015_30YF",
  YEAR_2016 = "2016",
  YEAR_2017 = "2017",
  YEAR_2018 = "2018",
  YEAR_2019 = "2019",
  YEAR_2020 = "2020",
  YEAR_2021 = "2021",
  YEAR_2022 = "2022",
  YEAR_2022_ERPR = "2022_ERPR",
  YEAR_2023 = "2023",
} */

/* I N T E R F A C E S */

interface ICountry {
  name: string;
  flagImage: string;
  joinedOn: string;
}

export interface ICountryModel extends ICountry, Document {}

export interface CreateCountryInput extends ICountry {}
