import express from "express";
import { Moment } from "moment";

export const sendError = (res: express.Response, code: number, msg: string) => {
  res.sendStatus(code);
  res.send({ message: msg });
};

export const getRandBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

interface HasCreatedAt {
  createdAt: Moment;
}

export const sortCreatedAtDesc = <T>(array: Array<T & HasCreatedAt>) => {
  return array.sort(({ createdAt: a }, { createdAt: b }) => {
    if (a.isAfter(b)) {
      return -1;
    } else if (a.isSame(b)) {
      return 0;
    } else {
      return 1;
    }
  });
};
