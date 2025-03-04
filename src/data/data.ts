const chatList: {
  images: string;
  name: string;
  message: string;
}[] = [
  {
    images: "/avatar.png",
    name: "John Doe",
    message: "hello",
  },
  {
    images: "/avatar.png",
    name: "Amit",
    message: "hii",
  },
  {
    images: "/avatar.png",
    name: "Ram",
    message: "new message",
  },
  {
    images: "/avatar.png",
    name: "Aditye",
    message: "mainmain",
  },
  {
    images: "/avatar.png",
    name: "Ram",
    message: "new message",
  },
  {
    images: "/avatar.png",
    name: "Aditye",
    message: "mainmain",
  },
  {
    images: "/avatar.png",
    name: "Ram",
    message: "new message",
  },
  {
    images: "/avatar.png",
    name: "Aditye",
    message: "mainmain",
  },
];

export default chatList;

const messages: {
  img?: string;
  botMessage?: string;
  time: string;
  class?: string;
  userMessage?: string;
  imageMessage?: boolean;
}[] = [
  {
    img: "/avatar.png",
    botMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
    time: "1 min ago",
  },
  {
    userMessage:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    time: "2 min ago",
    class: "self-end",
  },
  {
    img: "/avatar.png",
    botMessage:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    time: "3 min ago",
  },
  {
    img: "/avatar.png",
    userMessage:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.",
    time: "4 min ago",
    class: "self-end",
  },
  {
    img: "/avatar.png",
    botMessage:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    time: "5 min ago",
  },
  {
    userMessage:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "6 min ago",
    class: "self-end",
  },
  {
    userMessage: "",
    img: "/avatar.png",
    imageMessage: true,
    time: "7 min ago",
    class: "self-end",
  },
];

export { messages };

type Detail = {
  title: string;
  img: string;
  subItems?: { name: string; img: string; download: string }[]; // Optional sub-items
};

const details: Detail[] = [
  { title: "Chat Setting", img: "/arrowUp.png" },
  { title: "Privacy & Help", img: "/arrowUp.png" },
  {
    title: "Shared Photos",
    img: "/arrowUp.png",
    subItems: [
      {
        name: "photo_2024_1.png",
        img: "/avatar.png",
        download: "/download.png",
      },
      {
        name: "photo_2024_2.png",
        img: "/avatar.png",
        download: "/download.png",
      },
      {
        name: "photo_2024_3.png",
        img: "/avatar.png",
        download: "/download.png",
      },
      {
        name: "photo_2024_4.png",
        img: "/avatar.png",
        download: "/download.png",
      },
    ],
  },
  { title: "Shared Files", img: "/arrowUp.png" },
];

export { details };
