import { Schema, model, models } from "mongoose";
import { ICountryModel } from "../types/country.types";

/**
 * @openapi
 * components:
 *   schemas:
 *      Country:
 *        type: object
 *        description: Full Country object schema.
 *        properties:
 *          _id:
 *            type: string
 *            example: 66db5dd3d331876b91e76815
 *          name:
 *            type: string
 *            example: Portugal
 *          flagImage:
 *            type: string
 *            format: uri
 *            example: http://cloudinary/image
 *          joinedOn:
 *            type: string
 *            format: date
 *            example: 2002-02-02
 *          createdAt:
 *            type: string
 *            format: date-time
 *            example: 2024-09-06T19:53:55.486Z
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            example: 2024-09-07T07:51:31.262Z
 *
 */

const countrySchema = new Schema<ICountryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    flagImage: {
      type: String,
      required: true,
    },
    joinedOn: {
      type: String, // TODO solve this type error when sending in json
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CountryModel =
  models.Country || model<ICountryModel>("Country", countrySchema);

export default CountryModel;

// FOR FUTURE

/* stats of each country (stored here so it has no need to rewrite anytime soon) */

/* andorra -> {"2004": null,"2005": null,"2006": null,"2007": null,"2007_tor": null, "2008": null,"2009": null,"2009_emu": null,"2010": null,"2011": null,"2012": null,"2012_10y": null,"2013": null,"2014": true,"2015": true,"2015_30yf": false,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": false,"2023": false} */
/* austria -> {"2004": false,"2005": true,"2006": false,"2007": false,"2007_tor": true, "2008": false,"2009": false,"2009_emu": true,"2010": false,"2011": false,"2012": false,"2012_10y": true,"2013": false,"2014": false,"2015": false,"2015_30yf": true,"2016": true,"2017": false,"2018": true,"2019": false,"2020": false,"2021": false,"2022": false,"2022_erpr": true,"2023": false} */
/* belgium -> {"2004": false,"2005": true,"2006": true,"2007": false,"2007_tor": true, "2008": true,"2009": true,"2009_emu": true,"2010": true,"2011": true,"2012": true,"2012_10y": true,"2013": true,"2014": true,"2015": true,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": false} */
/* croatia -> {"2004": null,"2005": null,"2006": null,"2007": null,"2007_tor": null, "2008": null,"2009": null,"2009_emu": null,"2010": null,"2011": null,"2012": null,"2012_10y": null,"2013": null,"2014": null,"2015": null,"2015_30yf": null,"2016": null,"2017": null,"2018": null,"2019": null,"2020": null,"2021": null,"2022": null,"2022_erpr": null,"2023": false} */
/* cyprus -> {"2004": null,"2005": null,"2006": null,"2007": null,"2007_tor": null, "2008": false,"2009": false,"2009_emu": true,"2010": false,"2011": false,"2012": false,"2012_10y": true,"2013": false,"2014": false,"2015": false,"2015_30yf": true,"2016": false,"2017": true,"2018": false,"2019": false,"2020": true,"2021": false,"2022": false,"2022_erpr": true,"2023": false} */
/* estonia -> {"2004": null,"2005": null,"2006": null,"2007": null,"2007_tor": null, "2008": null,"2009": null,"2009_emu": null,"2010": null,"2011": false,"2012": false,"2012_10y": true,"2013": false,"2014": false,"2015": false,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": true} */
/* finland -> {"2004": true,"2005": true,"2006": true,"2007": true,"2007_tor": true, "2008": true,"2009": true,"2009_emu": true,"2010": true,"2011": true,"2012": true,"2012_10y": true,"2013": true,"2014": true,"2015": true,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": true} */
/* france -> {"2004": false,"2005": false,"2006": false,"2007": false,"2007_tor": true, "2008": true,"2009": false,"2009_emu": true,"2010": true,"2011": true,"2012": true,"2012_10y": Boolean,"2013": true,"2014": true,"2015": true,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": true} */
/* germany -> {"2004": false,"2005": false,"2006": true,"2007": true,"2007_tor": true, "2008": true,"2009": true,"2009_emu": true,"2010": true,"2011": true,"2012": true,"2012_10y": true,"2013": true,"2014": true,"2015": true,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": true} */
/* greece -> {"2004": true,"2005": false,"2006": false,"2007": false,"2007_tor": true, "2008": false,"2009": false,"2009_emu": true,"2010": true,"2011": true,"2012": false,"2012_10y": true,"2013": true,"2014": true,"2015": true,"2015_30yf": true,"2016": true,"2017": true,"2018": true,"2019": true,"2020": true,"2021": true,"2022": true,"2022_erpr": true,"2023": true} */

/* 
{"2004": Boolean,"2005": Boolean,"2006": Boolean,"2007": Boolean,"2007_tor": Boolean, "2008": Boolean,"2009": Boolean,"2009_emu": Boolean,"2010": Boolean,"2011": Boolean,"2012": Boolean,"2012_10y": Boolean,"2013": Boolean,"2014": Boolean,"2015": Boolean,"2015_30yf": Boolean,"2016": Boolean,"2017": Boolean,"2018": Boolean,"2019": Boolean,"2020": Boolean,"2021": Boolean,"2022": Boolean,"2022_erpr": Boolean,"2023": Boolean} */
