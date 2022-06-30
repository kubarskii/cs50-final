import React from 'react';
import Header from '../components/header/header';

function HomePage(props) {
  // eslint-disable-next-line react/prop-types
  const { data } = props;
  return (
    <>
      <Header />
      <div>Welcome to Next.js!</div>
      <div>{JSON.stringify(data)}</div>
    </>
  );
}

// export async function getServerSideProps() {
// Call an external API endpoint to get posts.
// You can use any data fetching library
// try {
//   // const res = await fetch('http://localhost:8080/api/v1/message');
//   // const data = await res.json();
//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       data,
//     },
//   };
// } catch (e) {
//   console.log(e);
//   return {
//     props: {},
//   };
// }
// }

export default HomePage;
