import { fetchData } from "./puppet.mjs";

export async function clickEvent(){
    try {
        await fetchData();
    } catch (error) {
        console.log(error);
    }
}

