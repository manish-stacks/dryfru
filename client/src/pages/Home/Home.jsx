import React from 'react'
import Hero from '../../components/Hero/Hero'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductShow from '../../components/ProductShow/ProductShow'
import Testimonial from '../../components/Testinonial/Testimonial'
import Blogs from '../Blogs/Blogs'

const Home = () => {
  return (
    <>
      <Hero />
      <ProductCard/>
      <ProductShow/>
      <Testimonial />
      <Blogs/>
    </>
  )
}

export default Home
