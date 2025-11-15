import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const history_Format = (sender, text) => {
  return {
    id: uuidv4(),
    role: sender,
    parts: [{ text: text }],
  };
};
