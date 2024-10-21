// import React, { Component } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { WebView } from 'react-native-webview';

// // ...
// const MyWebComponent = () => {
//   return <WebView source={{ uri: 'https://183.82.1.171:9443/' }} style={{ flex: 1 }} />;
// }
// import React, { Component } from 'react';
// import { WebView } from 'react-native-webview';

// const PortainerPage = ()=> {
//     return (
//       <WebView
//         source={{ uri: 'https://183.82.1.171:9443/' }}
//         style={{ marginTop: 20 }}
//       />
//     );
//   }
// export default PortainerPage;
import React from "react";
import ReactDOM from "react-dom";
import { KTCard } from "../../../_metronic/helpers/components/KTCard";
import { KTCardBody } from "../../../_metronic/helpers/components/KTCardBody";

const PortainerPage = () => {
  return (<KTCard>
    <KTCardBody className="py-4">
    <iframe src="https://183.82.1.171:9443/" style={{width: '100%', border: 'none'} } height={1080}/>
    </KTCardBody>
  </KTCard>)
  
}

export default PortainerPage;