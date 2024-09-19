import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { coinService } from "../service/coin.service";
import {
  CreateCoinInput,
  DeleteCoinInput,
  GetCoinInput,
  UpdateCoinInput,
} from "../schema";
import { countryService } from "../service/country.service";
import { catchAsyncErrors } from "../middleware/asyncErrorWrapper";
import { appAssert } from "../utils/appAssert";
import { AppErrorCode } from "../constants/appErrorCode";
import { CoinFilter } from "../types/coin.types";

export const createCoinHandler = catchAsyncErrors(
  async (
    req: Request<CreateCoinInput["params"], {}, CreateCoinInput["body"]>,
    res: Response
  ) => {
    const { countryName } = req.params;

    const country = await countryService.findByName({ name: countryName });

    appAssert(
      country,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COUNTRY_NOT_FOUND,
      "Country not found"
    );

    const coinData = { ...req.body, country: country._id };
    const coin = await coinService.create(coinData);
    return res.status(StatusCodes.CREATED).send(coin);
  }
);

// ----------------------------------------------------------------------

export const getCoinsHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { type, country } = req.query;
    const filter: CoinFilter = {};

    if (type) filter.type = type as string;
    if (country) {
      const countryId = await countryService.getCountryIdByName(
        country as string
      );
      filter.country = countryId;
    }

    const coins = await coinService.find(filter);
    return res.status(StatusCodes.OK).send(coins);
  }
);

// ----------------------------------------------------------------------

export const getCoinByIdHandler = catchAsyncErrors(
  async (req: Request<GetCoinInput["params"]>, res: Response) => {
    const { id } = req.params;

    const coin = await coinService.findById(id);

    appAssert(
      coin,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COIN_NOT_FOUND,
      "Coin not found"
    );

    return res.status(StatusCodes.OK).send(coin);
  }
);

// ----------------------------------------------------------------------

export const updateCoinHandler = catchAsyncErrors(
  async (
    req: Request<UpdateCoinInput["params"], {}, UpdateCoinInput["body"]>,
    res: Response
  ) => {
    const { id } = req.params;
    const { body } = req;

    const coin = await coinService.findAndUpdate({ id }, body, {
      new: true,
    });

    appAssert(
      coin,
      StatusCodes.NOT_FOUND,
      AppErrorCode.COIN_NOT_FOUND,
      "Coin not found"
    );

    return res.status(StatusCodes.OK).send(coin);
  }
);

// ----------------------------------------------------------------------

export const deleteCoinHandler = catchAsyncErrors(
  async (req: Request<DeleteCoinInput["params"]>, res: Response) => {
    const { id } = req.params;

    await coinService.delete({ id });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
);
