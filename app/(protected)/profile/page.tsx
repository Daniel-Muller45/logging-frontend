"use client"

import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client'
import { GetStaticProps, InferGetStaticPropsType } from 'next';


interface UserState {
    id: string | null;
}


type Repo = {
    id: string
}

export default function Page()
{

    const [user, setUser] = useState<UserState>({id: null});

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const {data: userData} = await supabase.auth.getUser();
            if (userData.user && userData.user.id) {
                setUser({id: userData.user.id});
            } else {
                setUser({id: null});
            }
        })();
    }, []);

    return(
        <div>
            {user.id}
        </div>
    );

}