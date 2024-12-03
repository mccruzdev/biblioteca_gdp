import { BACKEND_SERVER } from "../../../../../config/api";
import { useTokenUC } from "../../../../../context/user/user.hook";

export async function createBook (bookData: any){
    const { data: token } = useTokenUC();
    const res =  await fetch(`${BACKEND_SERVER}/book`, {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...bookData,
            pages: parseInt(bookData.pages)
        })
    })
    const data = await res.json()
    console.log(data)

}