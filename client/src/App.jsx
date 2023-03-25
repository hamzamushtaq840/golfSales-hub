import React from 'react'
import { Suspense } from 'react';
import { ColorRing } from 'react-loader-spinner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReList from './components/create/ReList';
import PrivateInfoEdit from './components/profile/PrivateInfoEdit';


const Listing = React.lazy(() => import('./pages/Listing'))
const Navbar = React.lazy(() => import('./components/Navbar'))
const SubListing = React.lazy(() => import('./components/listings/SubListing'))
const Create = React.lazy(() => import('./pages/Create'))
const Delivery = React.lazy(() => import('./pages/Delivery'))
const Messages = React.lazy(() => import('./pages/Messages'))
const Signin = React.lazy(() => import('./pages/Signin'))
const Signup = React.lazy(() => import('./pages/Signup'));
const RequireAuth = React.lazy(() => import('./components/RequireAuth'))
const ChooseCountry = React.lazy(() => import('./components/signin/ChooseCountry'))
const About = React.lazy(() => import('./pages/About'))
const Buying = React.lazy(() => import('./components/delivery/Buying'));
const Selling = React.lazy(() => import('./components/delivery/Selling'));
const SingleChat = React.lazy(() => import('./components/messages/SingleChat'));
const EditList = React.lazy(() => import('./components/create/EditList'));
const PrivateInfo = React.lazy(() => import('./components/profile/PrivateInfo'));
const PrivateListings = React.lazy(() => import('./components/profile/PrivateListings'));
const PrivateProfile = React.lazy(() => import('./components/profile/PrivateProfile'));
const PrivatePurchases = React.lazy(() => import('./components/profile/PrivatePurchases'));
const PublicInfo = React.lazy(() => import('./components/profile/PublicInfo'));
const PublicListing = React.lazy(() => import('./components/profile/PublicListings'));
const PublicProfile = React.lazy(() => import('./components/profile/PublicProfile'));

const ROLES = {
  'User': 2001,
  'Admin': 5150
}

const Loader =
  <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} className=''>
    <ColorRing
      visible={true}
      height="80"
      width="80"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      colors={['#494949', '#494949', '#494949', '#494949', '#494949']}
    />
  </div>

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/signin" element={<Suspense fallback={Loader}>< Signin /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={Loader}>< Signup /></Suspense>} />
        {/* Nested Public Routes */}
        <Route path="/signin">
          <Route path="country" element={<Suspense fallback={Loader}><ChooseCountry /></Suspense>} />
        </Route>

        {/* Public routes */}
        <Route path='/' element={<Navbar />}>
          <Route index element={<Suspense fallback={Loader}><Listing /></Suspense>} />
          <Route path="/create" element={<Suspense fallback={Loader}><Create /></Suspense>} />
          <Route path="/delivery" element={<Suspense fallback={Loader}><Delivery /></Suspense >} />
          <Route path="/messages" element={<Suspense fallback={Loader}><Messages /></Suspense >} />
          <Route path="/about" element={<Suspense fallback={Loader}><About /></Suspense>} />

          <Route path="/profile">
            <Route path="public" element={<Suspense fallback={Loader}><PublicProfile /></Suspense>} />
            <Route path="public/information" element={<Suspense fallback={Loader}><PublicProfile><PublicInfo /></PublicProfile></Suspense>} />
            <Route path="public/listings" element={<Suspense fallback={Loader}><PublicProfile><PublicListing /></PublicProfile></Suspense>} />
            <Route path="private" element={<Suspense fallback={Loader}><PrivateProfile /></Suspense>} />
            <Route path="private/information">
              <Route index element={<Suspense fallback={Loader}><PrivateProfile><PrivateInfo /></PrivateProfile></Suspense>} />
              <Route path="edit" element={<Suspense fallback={Loader}><PrivateProfile><PrivateInfoEdit /></PrivateProfile></Suspense>} />
            </Route>
            <Route path="private/listings" element={<Suspense fallback={Loader}><PrivateProfile><PrivateListings /></PrivateProfile></Suspense>} />
            <Route path="private/purchases" element={<Suspense fallback={Loader}><PrivateProfile><PrivatePurchases /></PrivateProfile></Suspense>} />
          </Route>

          <Route path="/create">
            <Route path="edit" element={<Suspense fallback={Loader}><EditList /></Suspense>} />
            <Route path="relist" element={<Suspense fallback={Loader}><ReList /></Suspense>} />
          </Route>

          <Route path="/messages">
            <Route path="chat" element={<Suspense fallback={Loader}><SingleChat /></Suspense>} />
          </Route>

          <Route path="/messages">
            <Route path="chat" element={<Suspense fallback={Loader}><SingleChat /></Suspense>} />
          </Route>

          <Route path="/delivery">
            <Route path="buying" element={<Suspense fallback={Loader}><Delivery><Buying /></Delivery></Suspense>} />
            <Route path="selling" element={<Suspense fallback={Loader}><Delivery><Selling /></Delivery></Suspense>} />
          </Route>
        </Route>

        {/*Nested Protected routes */}
        <Route path="/" element={<Suspense fallback={Loader}><RequireAuth allowedRoles={[ROLES.User]} /></Suspense>}>
          <Route path="/listing">
            <Route path="sublisting" element={<Suspense fallback={Loader}><Navbar><SubListing /></Navbar></Suspense>} />
          </Route>
        </Route>

      </Routes >
    </BrowserRouter >
  )
}

export default App