"use client"

import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Card } from '@/components/ui/card';
import Header from '@/app/components/Header';
import Image from 'next/image'
import profilePic from '../../assets/pfp.png'
import Head from 'next/head';

interface UserState {
  id: string | undefined
  username: string | undefined
  age: string | undefined
  height: string | undefined
  weight: string | undefined
  imageURL: string | undefined
}


type Repo = {
    id: string
}

export default function Page()
{

    const [user, setUser] = useState<UserState>({
      id: undefined,
      username: undefined,
      age: undefined,
      height: undefined,
      weight: undefined,
      imageURL: undefined
    })

    useEffect(() => {
            (async () => {
                try {
                    const supabase = createClient()
                    const { data: userData } = await supabase.auth.getUser()
                    if (userData.user && userData.user.id) {
                      setUser({
                        id: userData.user.id,
                        username: userData.user.email,
                        age: '25',
                        height: "5'10",
                        weight: '165',
                        imageURL: "/assets/phone.png"
                      })
                    } else {
                      setUser({
                        id: undefined,
                        username: undefined,
                        age: undefined,
                        height: undefined,
                        weight: undefined,
                        imageURL: undefined
                      })
                    }
                } catch (error) {
                    
                }
                
            })();
    }, []);

    return (
      <div style={styles.container}>
        <Image
          src={profilePic}
          alt="Profile Picture"
          width={200}
          height={200}
          style={styles.pfp}
        />
        <div style={styles.goalPanel}>
          <Card style={styles.goal}>
            <h2>Goal 1</h2>
          </Card>
          <Card style={styles.goal}>
            <h2>Goal 2</h2>
          </Card>
          <Card style={styles.goal}>
            <h2>Goal 3</h2>
          </Card>
        </div>
        <Card style={styles.profileInfo} className="profileInfo">
          <h2 style={styles.profileItem}>Email: {user.username}</h2>
          <h2 style={styles.profileItem}>Age: {user.age}</h2>
          <h2 style={styles.profileItem}>Height: {user.height}</h2>
          <h2 style={styles.profileItem}>Weight: {user.weight}</h2>
        </Card>
      </div>
    )

}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '50px',
  },
  pfp: {
    borderRadius: '50%',
    width: '20%',
    height: '20%',
    overflow: 'hidden',
  },
  goalPanel: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    gap: '100px',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  goal: {
    padding: '30px',
    // width: '20%',
  },
  profileInfo: {
    padding: '20px',
    width: '50%',
    textAlign: 'start',
  },
  profileItem: {
    padding: '20px'
  }
}