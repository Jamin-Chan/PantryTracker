'use client'

import { firestore } from "@/firebase";
import { Box, Button, Stack, Typography, Modal, TextField } from "@mui/material";
import { Firestore } from "firebase/firestore";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Nanum_Myeongjo } from "next/font/google";
import { useEffect, useState} from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "/firebase.js";
import Link from 'next/link';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}


export default function Home() {
  const [pantry, setPantry] = useState([])
  const [searchQuery, setSearchQuery] = useState(""); 

  const [open, setOpen] = useState(false)

  const handleGoogle = async (e) => {
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const updatePantry = async () => {
    const snapshot = query(collection(firestore,'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  
  useEffect(() => {  
    updatePantry()
  }, [])

  return (
    <Box>
      <Box 
        width={"100vw"} 
        height={"10%" } 
        position={"absolute"} 
        padding={3} 
        display={'flex'} 
        justifyContent={"space-between"} 
        flexDirection={"row"}
        zIndex={99}
      >
        <Typography variant={'h4'} color={'#333'}>
          🛒 Pantry Tracker
        </Typography>
        <Button variant="contained"
          onClick={() => {
            handleGoogle()
          }}
        >
          Sign In
        </Button>
      </Box>
      <Box width={"100vw"} height={"100vh"} flexDirection={'row'} display={'flex'} bgcolor={"#85ffbc"}>
        <Box
          width={"50vw"}
          height={"100vh"}
          flexDirection={'column'}
          display={'flex'} 
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          padding={4}
        >
          <Typography 
            variant={'h2'} 
            color={'#333'} 
            textAlign={"center"} 
            fontWeight={"bolder"}
            marginBottom={5}
          >
            Welcome to Pantry Tracker
          </Typography>
          <Typography padding={8} variant={'h4'} color={'#333'} style={{wordWrap: "break-word"}} textAlign={"center"}>
          Simplify your grocery shopping experience by easily creating, managing, and updating your list of food items you wish to purchase in the future. 
          Stay on top of your pantry essentials with our intuitive platform that helps you keep track of all your desired purchases.
          </Typography>
          <Link href="/pantry">
            <Button variant="contained">
                Get Started!
            </Button>
          </Link>
        </Box>
        <Box
          width={"50vw"}
          height={"100vh"}
          display={'flex'} 
          position={"relative"}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          padding={4}
        >
          <Box position={"absolute"} paddingBottom={10}>
            <img 
              src={"/images/customerShopping.png"}
              width={"100%"}
              height={"100%"}
            />
          </Box>
            <img 
              src={"https://lc4d8w.webwave.dev/lib/lc4d8w/background-kjoiznwi.svg"}
            />
        </Box>
      </Box>
    </Box>
  )
}
