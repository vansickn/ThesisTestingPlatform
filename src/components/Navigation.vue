<template>
<header>
    <nav class="container">
        <div class="branding">
            <router-link class="header" to="/">Youtube AB Testing</router-link>
        </div>
        <div class="nav-links">
            <ul v-show="!mobile">
                <router-link class = "link" to="/">Home</router-link>
                <router-link class = "link" to="#">About Thumbnail Testing</router-link>
                <router-link v-if="!loggedIn" class = "link" to="/register">Login With Google </router-link> 
                <router-link v-if="loggedIn" class = "link" to="/createtest">Create Test</router-link>
                <router-link v-if="loggedIn" class = "link" to="/account">Account</router-link>
                <Coin v-if="user.data != null" :coins="coins"/> 
            </ul>
        </div>
    </nav>
    <svg @click="toggleMobileNav" id='menu-icon' v-show="mobile" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"></path></svg>
    <!-- <menuIcon @click="toggleMobileNav" class='menu-icon' v-show="mobile" /> -->
    <transition name='mobile-nav'>
       <ul class="mobile-nav" v-show="mobileNav">
            <router-link @click="toggleMobileNav" class = "link" to="/">Home</router-link>
            <router-link @click="toggleMobileNav" class = "link" to="#">About Thumbnail Testing</router-link>
            <router-link v-if="!loggedIn" @click="toggleMobileNav" class = "link" to="/register">Login With Google </router-link> 
            <router-link v-if="loggedIn" @click="toggleMobileNav" class = "link" to="/createtest">Create Test</router-link>
            <router-link @click="toggleMobileNav" v-if="loggedIn" class = "link" to="/account">Account</router-link>
        </ul>
    </transition>
</header>
</template>

<script>

// import { defineComponent } from '@vue/composition-api';
import menuIcon from '../assets/Icons/bars-regular.svg';
import Coin from '../components/Coin.vue'
import firebase from 'firebase';
import { mapGetters} from 'vuex';
import { useRouter } from 'vue-router';


const router = useRouter();

// const db = firebase.firestore();
// const db = firebase.firestore();

export default {
    name: 'navigation',
    components: {
        menuIcon,
        Coin,
    },
    data() {
        return {
            mobile: null,
            mobileNav: null,
            windowWidth: null,
            coins: 0,
        };
    },
    // computed:{
    //     ...mapGetters({
    //         user: "user"
    //     })
    // },
    props: {
        loggedIn: Boolean,
        user: Object
    },
    async created() {
        
    },
    async mounted(){
        window.addEventListener('resize',this.checkScreen);
        this.checkScreen();
        this.listenForCoins();
    },
    methods: {
        checkScreen() {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth <= 1050){
                this.mobile = true;
                return;
            }
            this.mobile = false
            this.mobileNav = false
            return;
        },
        toggleMobileNav() {
            this.mobileNav = !this.mobileNav
        },
        listenForCoins(){
            // console.log(firebase.auth().currentUser) 
            // Prevents an error, but still the user is not being fetched in time for the components to be able to handle it. This is a site wide issue, but this is a prime example of it. Need to figure out how to accomplish this.
            if(this.user.data != null){
                firebase.firestore().collection("users").doc(this.user.data.uid).onSnapshot({}, doc => {
                    this.coins = doc.data().coins
                })
            }else{
                console.log("User is Null")
            }
        },
        test(){
            console.log(this.user.data)
        }
    }
};
</script>

<style lang='scss' scoped>
header {
    background-color: #fff;
    padding: 0 25px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,1), 0 2px 4px -1px rgba(0,0,0,0.06);
    z-index: 99;

    .link {
        font-weight: 500;
        padding: 0 8px;
        transition: .3s color ease;

        &:hover {
            color: #ef233c
        }
    }

    nav {
        display: flex;
        padding: 25px 0;

        .branding {
            display: flex;

            .header {
                font-weight: 600;
                font-size: 24px;
                color: #000;
                text-decoration: none;
            }
        }

        .nav-links {
            position: relative;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;

            ul {
                margin-right: 32px;

                .link {
                    margin-right: 32px;
                }

                .link:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    #menu-icon {
        cursor: pointer;
        position: absolute;
        top: 32px;
        right: 25px;
        height: 25px;
        width: auto;
    }

    .mobile-nav {
        padding: 20px;
        width: 70%;
        max-width: 250px;
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100%;
        background: #303030;
        top: 0;
        left: 0;

        .link {
        padding: 15px;
        color: #fff;
        }
    }

    .mobile-nav-enter-active {
        transition: all 1s ease
    }
    .mobile-nav-leave-active {
        transition: all 1s ease
    }
    .mobile-nav-enter {
        transform: translateX(-250px);
    }
    .mobile-nav-enter-to {
        transform: translateX(0px);
    }
    .mobile-nav-leave-to {
        transform: translateX(-250px);
    }
    
}

</style>
