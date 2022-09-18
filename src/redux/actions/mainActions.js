import { SET_BALANCE, SET_BOUGHTITEMS, SET_CATEGORY, SET_LISTINGPRICE, SET_LOADING, SET_MARKET_ITEMS, SET_MINE_ITEMS, SET_RESELLPRICE } from "../type"
import axios from "axios"
import { MORALIS_API_KEY } from "../../constants/Constants"

let decimal = 10 ** 18

export const mainAction = {
    getBalanceOfBNB: (web3, wallet) => async (dispatch) => {
        const balance = await web3.eth.getBalance(wallet)
        dispatch({ type: SET_BALANCE, payload: Number(balance) / decimal })
    },

    getInitialValue: (marketContract) => async (dispatch) => {
        const result = await Promise.all([
            marketContract.methods.getListingPrice().call(),
            marketContract.methods.getCategories().call(),
            marketContract.methods.getResellPrice().call()
        ])
        dispatch({ type: SET_LISTINGPRICE, payload: Number(result[0]) / decimal})
        dispatch({ type: SET_CATEGORY, payload: result[1] })
        dispatch({ type: SET_RESELLPRICE, payload: Number(result[2]) / decimal})
    },

    getMarketItems: (marketContract) => async (dispatch) => {
        try {
            dispatch({ type: SET_LOADING, payload: true})
            const items = await marketContract.methods.fetchMarketItems().call()
            let metaFuncs = []
            items.forEach((item) => { metaFuncs.push(axios.get(item.metadataURL)) })
            const results = await Promise.all(metaFuncs)

            let marketItems = []
            results.forEach((result, index) => {
                marketItems.push({
                    id: items[index].itemId,
                    name: result.data.name,
                    description: result.data.description,
                    src: items[index].imgURL,
                    price: Number(items[index].price) / decimal,
                    tokenId: items[index].tokenId,
                    category: items[index].category
                })
            })
            dispatch({ type: SET_MARKET_ITEMS, payload: marketItems })
            dispatch({ type: SET_LOADING, payload: false})
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING, payload: false})
        }
    },

    getMyNFTItems: (marketContract, wallet) => async (dispatch) => {
        try {
            dispatch({ type: SET_LOADING, payload: true})
            const items = await marketContract.methods.fetchMyNFT().call({ from: wallet })
            let metaFuncs = []
            items.forEach((item) => { metaFuncs.push(axios.get(item.metadataURL)) })
            const results = await Promise.all(metaFuncs)

            let marketItems = []
            results.forEach((result, index) => {
                marketItems.push({
                    id: items[index].itemId,
                    name: result.data.name,
                    description: result.data.description,
                    src: items[index].imgURL,
                    price: Number(items[index].price) / decimal,
                    tokenId: items[index].tokenId,
                    category: items[index].category,
                    metaData: items[index].metadataURL
                })
            })
            dispatch({ type: SET_BOUGHTITEMS, payload: marketItems })
            dispatch({ type: SET_LOADING, payload: false})
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING, payload: false})
        }
    },

    getNFTsFromWallet: (wallet) => async (dispatch) => {
        try {
            dispatch({ type: SET_LOADING, payload: true })
            const response = await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=0x61&format=decimal`,{
                headers: {
                    accept: 'application/json',
                    'X-API-Key': MORALIS_API_KEY
                }
            })
            dispatch({ type: SET_MINE_ITEMS, payload: response.data.result })
            dispatch({ type: SET_LOADING, payload: false })
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING, payload: false })
        }
    }
}