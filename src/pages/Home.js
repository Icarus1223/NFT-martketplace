import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Hero from "../components/Hero"
import CardList from "../components/CardList"
import { mainAction } from "../redux/actions/mainActions"
import "../styles/Home.css"

const Home = () => {
  const dispatch = useDispatch()
  const main = useSelector(state => state.main)
  const { marketContract, marketItems } = main

  useEffect(() => {
    if(marketContract) dispatch(mainAction.getMarketItems(marketContract))
  }, [marketContract])

  return (
    <div id="home">
      <Hero />
      <p id="card-list-header-text"> Hot Drops </p>
      <div id="list-container">
        <CardList list={marketItems.reverse().slice(0, 9)} />
      </div>
    </div>
  )
}

export default Home;
