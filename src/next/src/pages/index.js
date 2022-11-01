import React from 'react';
import Header from '../components/head/header';
import Container from '../components/container/container';

const inputParser = (data) => {
  console.log(data);
};

const messageParser = (data) => {
  console.log(data);
};

const initialMessages = [
  {
    type: 'message',
    sender: 'bot',
    props: {
      text: '312',
    },
    uniqueId: '1',
  },
  {
    type: 'message',
    sender: 'user',
    props: {
      text: '312',
    },
    uniqueId: '2',
  },
];

function HomePage(props) {
  // eslint-disable-next-line react/prop-types
  const { data } = props;
  return (
    <>
      <Header />
      <Container
        initialMessages={initialMessages}
        inputParser={inputParser}
        messageParser={messageParser}
        {...{
          header: {
            title: 'Chat',
            logoStyles: {
              marginRight: '6px',
            },
            logoContainerStyle: {
              minHeight: 0,
              minWidth: 0,
              maxHeight: '100%',
              height: '100%',
            },
            titleStyle: {
              fontWeight: '400',
            },
            headerStyles: {
              background: '#0C2340',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              boxSizing: 'border-box',
              padding: '0 12px',
              flex: 0,
              fontSize: '18px',
            },
          },
          containerStyles: {
            display: 'flex',
            height: '100%',
            flex: 1,
            flexDirection: 'column',
            background: '#f7f7f7',
            overflow: 'hidden',
            borderRadius: '4px',
          },
          footer: {
            placeholder: 'Type your message here...',
            buttonStyles: {
              cursor: 'pointer',
              background: 'transparent',
              padding: 0,
              border: 'none',
              outline: 'none',
            },
            containerStyles: {
              background: 'rgb(12, 35, 64)',
              height: '80px',
              width: '100%',
              display: 'flex ',
              borderTop: '1px solid #ccc',
              boxSizing: 'border-box',
              padding: '0 12px',
            },
            inputWrapperStyles: {
              fontSize: '1rem',
              backgroundColor: '#fff',
              marginRight: '8px',
            },
          },
        }}
      />
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
