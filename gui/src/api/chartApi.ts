import { ideMessenger } from "./ideMessenger";
export async function getAnswers(question: any) {
  return ideMessenger.request("daik.getChatAnswer", question).then((res) => {
    console.log("getChatAnser:", res);
    return res;
  });
}
