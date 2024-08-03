'use client'

import { firestore } from "@/firebase";
import { Box, Button, Stack, Typography, Modal, TextField } from "@mui/material";
import { Firestore } from "firebase/firestore";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Nanum_Myeongjo } from "next/font/google";
import { useEffect, useState} from "react";
import Image from "next/image";



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
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const[itemName, setItemName] = useState('')

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

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    //check if it exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
      await updatePantry()
      return
    } else{
      await setDoc(docRef, {count: 1})
    }

    await updatePantry()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const {count} = docSnap.data()
      if(count == 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updatePantry()
  }

  const filteredSearch = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
      >
        <Typography variant={'h4'} color={'#333'}>
          🛒 Pantry Tracker
        </Typography>
        <Button variant="contained"
          onClick={() => {
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
      <Box 
        width={"100vw"}
        height={"100vh" }
        display={'flex'} 
        justifyContent={'center'}
        flexDirection={'column'} 
        alignItems={'center'}
        gap={2}
      >
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width={'100%'} direction={'row'} spacing={2}>
              <TextField 
                id="outlined-basic" 
                label="Item" 
                variant="outlined" 
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="outlined" 
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>Add</Button>
        <Box border={'1px solid #333'}>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "800px" }}
          />
          <Box 
            width={'800px'} 
            height={'100px'} 
            bgcolor={'#ADDBE6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Pantry Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {filteredSearch.map(({name, count}) => (
              <Box 
                key={name}
                width="100%" 
                minHeight="100px" 
                display={'flex'} 
                justifyContent={'space-between'} 
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                padding={3}
              > 
                <Typography
                  variant={'h4'}
                  color={'#333'}
                  textAlign={'center'}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                <Typography
                  variant={'h4'}
                  color={'#333'}
                  textAlign={'center'}
                >
                  Quantity: {count}
                </Typography>
              
                <Button variant="contained" onClick={() => removeItem(name)}> 
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
