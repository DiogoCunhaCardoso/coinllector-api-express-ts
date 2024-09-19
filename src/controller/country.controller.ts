import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { countryService } from "../service/country.service";
import {
  CreateCountryInput,
  DeleteCountryInput,
  GetCountryInput,
  UpdateCountryInput,
} from "../schema/country.schema";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { AppErrorCode } from "../constants/appErrorCode";
import { appAssert } from "../utils/appAssert";
import { uploadImage } from "../utils/cloudinary";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "../constants/imageRules";

export const createCountryHandler = catchAsyncErrors(
  async (req: Request<{}, {}, CreateCountryInput["body"]>, res: Response) => {
    const { name } = req.body;
    const existingCountry = await countryService.findByName({ name });

    appAssert(
      !existingCountry,
      StatusCodes.CONFLICT,
      AppErrorCode.COUNTRY_NAME_IN_USE,
      "Country name is already in use"
    );

    appAssert(
      req.file,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.FILE_NOT_FOUND,
      "No flag image uploaded"
    );

    appAssert(
      ACCEPTED_IMAGE_TYPES.includes(req.file.mimetype),
      StatusCodes.BAD_REQUEST,
      AppErrorCode.INVALID_FILE_TYPE,
      "Invalid file type. Only JPEG, JPG and PNG are allowed."
    );

    appAssert(
      MAX_IMAGE_SIZE >= req.file.size,
      StatusCodes.BAD_REQUEST,
      AppErrorCode.INVALID_FILE_TYPE,
      "Image is too big. Max is 2mb"
    );

    const uploadResult = await uploadImage(
      req.file.path,
      `country_flag_${name}`
    );

    appAssert(
      uploadResult,
      StatusCodes.INTERNAL_SERVER_ERROR,
      AppErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to upload flag image"
    );

    const country = await countryService.create({
      ...req.body,
      flagImage: uploadResult.secure_url,
    });
    return res.status(StatusCodes.CREATED).send(country);
  }
);

// ----------------------------------------------------------------------

export const getCountriesHandler = catchAsyncErrors(
  async (_: Request, res: Response) => {
    const countries = await countryService.find();
    return res.status(StatusCodes.OK).send(countries);
  }
);

// ----------------------------------------------------------------------

export const getCountryByNameHandler = catchAsyncErrors(
  async (req: Request<GetCountryInput["params"]>, res: Response) => {
    const { name } = req.params;

    const country = await countryService.findByName({ name });

    appAssert(
      country,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COUNTRY_NOT_FOUND,
      "Country not found"
    );

    return res.status(StatusCodes.OK).send(country);
  }
);

// ----------------------------------------------------------------------

export const updateCountryHandler = catchAsyncErrors(
  async (
    req: Request<UpdateCountryInput["params"], {}, UpdateCountryInput["body"]>,
    res: Response
  ) => {
    const { name } = req.params;
    const { body } = req;

    const country = await countryService.findAndUpdate({ name }, body, {
      new: true,
    });

    appAssert(
      country,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COUNTRY_NOT_FOUND,
      "Country not found"
    );

    return res.status(StatusCodes.OK).send(country);
  }
);

// ----------------------------------------------------------------------

export const deleteCountryHandler = catchAsyncErrors(
  async (req: Request<DeleteCountryInput["params"]>, res: Response<void>) => {
    const { name } = req.params;

    await countryService.delete({ name });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

//TODO. If I delete a country the image associated with it is also deleted.
//TODO. Add image on update aswell.
