<template>
  <q-page>
    <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
      <div class="col">
        <q-input
          bottom-slots
          v-model="newYatText"
          placeholder="What's happening"
          counter
          maxlength="280"
          autogrow
          class="newYatText"
        >
          <template v-slot:before>
            <q-avatar size="xl">
              <img src="https://s.gravatar.com/avatar/85ee0da154b77f7af13881177b6b40a5?s=80">
            </q-avatar>
          </template>
        </q-input>
      </div>
      <div class="col col-shrink">
        <q-btn
          @click="addNewYat"
          round
          flat
          icon="send"
          color="primary"
          :disable="!newYatText"
          class="q-mb-lg"
        />
      </div>
    </div>

    <q-separator size="10px" color="grey-2" class="divider" />

    <q-list separator>
      <transition-group
        appear
        enter-active-class="animated fadeIn slow"
        leave-active-class="animated fadeOut slow"
      >
        <q-item class="q-py-md" v-for="yat in yats" :key="yat.id">
        <q-item-section avatar top>
          <q-avatar>
            <img src="https://s.gravatar.com/avatar/85ee0da154b77f7af13881177b6b40a5?s=80">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1">
            <strong>Dmitry Grigorev</strong>
            <span class="text-grey-7">
              @dagrigorev
              &bull; {{ relativeDate(yat.date) }}
            </span>
          </q-item-label>
          <q-item-label class="yat-content text-body1">
            {{ yat.content }}
          </q-item-label>
          <div class="row justify-between q-mt-sm yat-icons">
            <q-btn
              flat
              round
              color="grey"
              icon="far fa-comment"
              size="sm"
            />
            <q-btn
              flat
              round
              color="grey"
              icon="fas fa-retweet"
              size="sm"
            />
            <q-btn
              @click="likeYat(yat)"
              flat
              round
              :color="yat.liked ? 'pink' : 'grey'"
              :icon="yat.liked ?  'fas fa-heart' : 'far fa-heart'"
              size="sm"
            />
            <q-btn
              @click="deleteYat(yat)"
              flat
              round
              color="grey"
              icon="fas fa-trash"
              size="sm"
            />
          </div>
        </q-item-section>
      </q-item>
      </transition-group>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { formatDistance } from "date-fns";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import db from 'src/boot/firebase';

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newYatText: '',
      yats: []
    };
  },
  methods: {
    async likeYat(yat) {
      yat.liked = !yat.liked;
      await updateDoc(doc(db, 'yats', yat.id), yat);
    },
    async addNewYat() {
      let newYat = {
        content: this.newYatText,
        date: Date.now(),
        liked: false
      };

      // Add a new document with a generated id.
      await addDoc(collection(db, "yats"), newYat);

      this.newYatText = '';
    },
    async deleteYat(yat) {
      await deleteDoc(doc(db, "yats", yat.id));
    },
    relativeDate(value) {
      return formatDistance(value, new Date());
    }
  },
  mounted() {
    const q = query(collection(db, "yats"), orderBy("date", "asc"));
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let yatChange = change.doc.data();
        yatChange.id = change.doc.id;
        if (change.type === "added") {
          // console.log("New yat: ", change.doc.data());
          this.yats.unshift(yatChange);
        }
        if (change.type === "modified") {
          // console.log("Modified yat: ", change.doc.data());
          const index = this.yats.findIndex(yat => yat.id == change.doc.id);
          Object.assign(this.yats[index], yatChange);
        }
        if (change.type === "removed") {
          // console.log("Removed yat: ", change.doc.data());
          const index = this.yats.findIndex(yat => yat.id == change.doc.id);
          this.yats.splice(index, 1);
        }
      });
    });
  }
})
</script>

<style lang="sass">
.newYatText
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.yat-content
  white-space: pre-line
.yat-icons
  margin-left: -5px
</style>
