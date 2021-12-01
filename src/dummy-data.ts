import {Book} from "./shared/models";

const reactImageUri = "https://reactjs.org/logo-og.png";
const jsImageUri =
  "https://www.cloudsavvyit.com/p/uploads/2021/02/c123ee3a.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1";

export const DUMMY_BOOKS_DATA: Book[] = [
  {
    id: 1,
    name: "React-1",
    imageUri: reactImageUri,
    desc: "ReactJS",
    price: 340,
    rating: 4.5,
  },
  {
    id: 2,
    name: "React-2",
    imageUri: reactImageUri,
    desc: "Intro to React",
    price: 140,
    rating: 2,
  },
  {
    id: 3,
    name: "React-3",
    imageUri: reactImageUri,
    desc: "Why React",
    price: 400,
  },
  {
    id: 4,
    name: "React-4",
    imageUri: reactImageUri,
    desc: "React components",
    price: 690,
  },
  {
    id: 5,
    name: "React-5",
    imageUri: reactImageUri,
    desc: "React hooks",
    price: 850,
  },
  {
    id: 6,
    name: "Javascript-1",
    imageUri: jsImageUri,
    desc: "indepth javascript",
    price: 1080,
  },
  {
    id: 7,
    name: "Javascript-2",
    imageUri: jsImageUri,
    desc: "javascript basics",
    price: 265,
  },
  {
    id: 8,
    name: "Javascript-3",
    imageUri: jsImageUri,
    desc: "promises and callback",
    price: 790,
  },
  {
    id: 9,
    name: "Javascript-4",
    imageUri: jsImageUri,
    desc: "basic js part-2",
    price: 114,
  },
  {
    id: 10,
    name: "Javascript-5",
    imageUri: jsImageUri,
    desc: "basic js",
    price: 198,
  },
];
