<template>
  <Suspense>
    <NuxtLayout>
      <UContainer class="max-w-3xl">
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- TITLE AND BACK BUTTON -->
          <div class="flex justify-between gap-5">
            <div class="text-2xl font-bold">
              <div class="flex items-center space-x-5">
                <button
                  @click.prevent="$router.go(-1)"
                  class="text-black hover:underline"
                >
                  <UIcon name="mynaui:arrow-left" />
                </button>
                <span>#{{ id }}:</span>
                <span>{{ title }}</span>
              </div>
              <div v-if="errorMessage" class="text-red-600">
                {{ errorMessage }}
              </div>
            </div>

            <div class="">
              <UButton
                type="submit"
                icon="mynaui:refresh"
                size="md"
                color="green"
                variant="solid"
                :loading="loading"
                label="Update"
                class="bg-green-400 hover:bg-green-200 text-white rounded-lg p-2"
                :trailing="false"
              />

              <UModal v-model="updateSuccess">
                <div
                  class="fixed inset-0 flex items-center justify-center z-50"
                >
                  <div
                    class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
                  >
                    <!-- Modal content -->
                    <div class="text-center">
                      <!-- You can add an icon here if needed -->
                      <UIcon
                        name="mynaui:smile-circle"
                        class="text-5xl text-green-500 mb-4"
                      />
                      <p class="text-lg text-gray-800 dark:te xt-white mb-2">
                        Update Successful!
                      </p>
                      <!-- Add any additional content here -->
                    </div>
                  </div>
                </div>
              </UModal>

              <UModal v-model="updateFalse">
                <div
                  class="fixed inset-0 flex items-center justify-center z-50"
                >
                  <div
                    class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
                  >
                    <div class="flex justify-end">
                      <UButton
                        color="gray"
                        size="md"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-3"
                        @click="updateFalse = false"
                      />
                    </div>
                    <!-- Modal content -->
                    <div class="text-center">
                      <!-- You can add an icon here if needed -->

                      <UIcon
                        name="mynaui:sad-circle"
                        class="text-5xl text-red-500 mb-4"
                      />
                      <p class="text-lg text-gray-800 dark:te xt-white mb-2">
                        Fail to Update
                      </p>
                      <!-- Add any additional content here -->
                    </div>
                  </div>
                </div>
              </UModal>
            </div>
          </div>

          <!-- Department -->
          <div class="flex align-middle justify-between gap-4 mt-5">
            <div class="">
              <label class="font-semibold">Department</label>
              <UFormGroup name="selectedDepartment">
                <USelectMenu
                  :options="departments?.response as any || []"
                  v-model="state.department_id"
                  value-attribute="departmentid"
                  option-attribute="title"
                  class="mt-1 w-52"
                  searchable
                />
              </UFormGroup>
            </div>

            <!-- Status -->
            <div class="">
              <label class="font-semibold">Status</label>
              <UFormGroup name="selectedStatus">
                <USelectMenu
                  :options="statusd?.response as any || []"
                  v-model="state.ticket_status_id"
                  value-attribute="ticketstatusid"
                  option-attribute="title"
                  class="mt-1 w-52"
                />
              </UFormGroup>
            </div>
          </div>

          <!-- Rating -->
          <div class="mt-3">
            <span class="font-semibold">Rating</span>
            <UFormGroup name="selectedRating">
              <URadioGroup
                :options="ratings?.response as any || []"
                v-model="state.rating"
                value-attribute="id"
                option-attribute="value"
                class="m-1"
              />
            </UFormGroup>
          </div>

          <!-- Level -->
          <div>
            <span class="font-semibold">Level</span>
            <div class="mt-1">
              <UFormGroup name="selectlevel">
                <UCheckbox
                  v-for="level in levels?.response as any || []"
                  v-model="state.level"
                  :key="level.id"
                  :value="level.id"
                  :label="level.value"
                  class="m-1"
                />
              </UFormGroup>
            </div>
          </div>

          <!-- Technical Skill -->
          <div>
            <span class="font-semibold">Unsatisfied Technical Skill</span>
            <UFormGroup name="selectedsatisfied">
              <USelectMenu
                :options="technicals?.response as any || []"
                v-model="state.skill"
                value-attribute="id"
                option-attribute="value"
                class="w-52 justify-between gap-4 mt-2 mr-40 bg-white dark:bg-gray-800"
              >
              </USelectMenu>
            </UFormGroup>
          </div>

          <div class="space-y-8">
            <!-- Add Comment -->
            <div>
              <div class="flex justify-between">
                <label class="font-semibold">Comment</label>
                <UButton
                  icon="mynaui:plus"
                  size="md"
                  color="blue"
                  variant="solid"
                  label="Add Comment"
                  :trailing="false"
                  class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                  @click="addComment"
                  :disabled="
                    state.comments.some((comment) => !comment.description)
                  "
                />
              </div>
            </div>

            <!-- Comment Section -->

            <UFormGroup
              name="description"
              class="space-y-4"
              v-for="(cmt, index) in state.comments"
              :key="index"
              :class="{
                '': !cmt.description && isNewComment(index),
              }"
            >
              <div class="grid grid-cols-6 gap-4">
                <UTextarea
                  placeholder="Comment..."
                  resize
                  class="col-span-5"
                  v-model="cmt.description"
                  name="description"
                />

                <!-- DELETE Button -->
                <div class="flex items-center">
                  <UButton
                    v-if="isNewComment(index)"
                    icon="mynaui:trash"
                    size="md"
                    color="red"
                    variant="solid"
                    label="Delete"
                    :trailing="false"
                    @click="deleteComment(index)"
                    class="h-11"
                  />
                </div>
              </div>
              <span
                v-if="!cmt.description && isNewComment(index)"
                class="error-text text-red-500 text-sm font-semibold"
                >Comment description is required</span
              >
            </UFormGroup>
          </div>
          <Dropdown v-pre />
        </UForm>
      </UContainer>
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
// Import types from external files
import type { FormError } from "#ui/types";
import axios from "axios";
import { ref, reactive, Comment } from "vue";
import { useUser } from "~/composables/states";

//middleware
definePageMeta({
  middleware: [function (to, from) {}],
});

//state
interface Comment {
  commentid: number | null;
  ticketid: 0;
  description: "";
  createby: "";
  updateby: string;
  createdat: "";
  updatetime: string;
}

const state = reactive({
  department_id: 0,
  ticket_status_id: 0,
  rating: 0,
  level: [],
  skill: 0,
  creator: "",
  comments: [
    {
      ticketid: 0,
      description: "",
      updateby: "",
      updatetime: "",
    },
  ] as Comment[],
});

//state store
onMounted(() => {
  const savedState = localStorage.getItem("formState");
  if (savedState) {
    Object.assign(state, JSON.parse(savedState));
  }
});

// Watch for changes in state and save it to localStorage
watch(state, (currentState) => {
  localStorage.setItem("formState", JSON.stringify(currentState));
});

// Clear the state when exiting the page
onBeforeUnmount(() => {
  localStorage.removeItem("formState");
});

// Use the defaultData function to set the default values
const user = useUser();

const title = ref("");

const { id } = useRoute().params;

const updateFalse = ref(false);

const ticketsUnavailable = ref(false);

const isLoading = ref(false);

const updateSuccess = ref(false);

var date = new Date().toISOString();

const route = useRouter();

const loading = ref(false);

const departmentId = ref();

const showCommentSection = ref(false);

const header = useRequestHeaders();

const errorMessage = ref<string>("");

// Validate function
function validate(state: any): FormError[] {
  const errors = [];

  if (!state.rating) {
    errors.push({
      path: "selectedRating",
      message: "Rating is required",
    });
  }

  if (!state.skill) {
    errors.push({
      path: "selectedsatisfied",
      message: "At least one technical skill must be selected",
    });
  }

  if (!state.ticket_status_id) {
    errors.push({
      path: "selectstatus",
      message: "Status is required",
    });
  }

  if (state.level[0] === "") {
    errors.push({ path: "selectlevel", message: "Select at least one" });
  }

  if (!state.department_id) {
    errors.push({
      path: "selectedDepartment",
      message: "Department is required",
    });
  }

  state.comments.forEach((comment: any, index: number) => {
    if (!comment.description && isNewComment(index)) {
      errors.push({
        path: `comments[${index}].description`,
        message: "Comment description is required",
      });
    }
  });
  return errors;
}

// Add Comment function
const addComment = () => {
  // Create a new comment object
  const newComment = {
    commentid: null,
    ticketid: Number(id),
    description: "",
    createby: user.$state.user.username,
    updateby: user.$state.user.username,
    createdat: date,
    updatetime: date,
  };
  // Add the new comment to the beginning of the array
  state.comments.push(newComment as Comment);
  // Always show the comment section after adding a comment
  showCommentSection.value = true;
};
// isNewComment function
const isNewComment = (index: number) => {
  const comment = state.comments[index];
  return comment && comment.commentid === null;
};

// Delete Comment function
const deleteComment = (index: number) => {
  if (isNewComment(index)) {
    state.comments.splice(index, 1);
  }
};

// Fetch data for levels, ratings, and technicals
const { data: ticketgets, error } = await useAsyncData("ticketgets", () =>
  $fetch("/api/ticketget", {
    server: false,
    lazy: false,
    method: "POST",
    headers: header,
    body: {
      ticketid: id,
      brand_id: user.$state.user.brandid,
    },

    onResponse({ response }) {
      // Handle the response success
      const data = response._data;
      state.department_id = data.response.departmentid;
      state.ticket_status_id = data.response.ticketstatusid;
      state.rating = data.response.rating;
      state.level = data.response.level;
      state.comments = data.response.comments;
      state.skill = data.response.skill;
      state.creator = user.$state.user.username;
      title.value = data.response.subject;
      departmentId.value = state.department_id;
    },
    onResponseError({ request, response, options }) {
      if (error.value || !ticketgets) {
        ticketsUnavailable.value = true;
      }
      errorMessage.value = "Failed to load data. Please try again later.";
      console.error(
        "Error fetching data:",
        response.status,
        response.statusText
      );
      isLoading.value = false;
    },
  })
);

if (error.value) {
  errorMessage.value = "Failed to load data. Please try again later.";
}

// If ticketgets is not available, set error message
if (!ticketgets) {
  errorMessage.value = "Failed to load data. Please try again later.";
}

const onSubmit = async () => {
  const currentUser = user.$state.user.username;
  const currentDate = new Date().toISOString();
  state.comments.forEach((comment) => {
    comment.updateby = currentUser;
    comment.updatetime = currentDate;
  });
  state.rating = Number(state.rating);
  const originalSkill = state.skill;
  // Convert state.skill to a number if needed
  state.skill = Number(state.skill);
  const update = await axios
    .post(
      "/api/updatesurvey",
      {
        ticketid: id,
        states: state,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      state.skill = originalSkill;
      loading.value = true;
      //handle response
      updateSuccess.value = true;

      route.go(-1);

      return response;
    })
    .catch(function (error) {
      state.skill = originalSkill;
      loading.value = false;
      //handle error
      updateFalse.value = true;
      return error;
    });
};

const { data: departments } = await useAsyncData("department", () =>
  $fetch("/api/department", {
    lazy: false,
    server: false,
    method: "POST",
    headers: header,
    body: {
      departmentid: state.department_id,
      brand_id: user.$state.user.brandid,
    },
  })
);

const { data: statusd } = await useAsyncData(
  "tsstatus",
  () =>
    $fetch("/api/status", {
      lazy: false,
      server: false,
      method: "POST",
      headers: header,
      body: {
        dep_id: state.department_id,
        ticketstatusid: 1,
      },
    }),
  {
    watch: [() => state.department_id],
  }
);

const { data: levels } = await useAsyncData("levels", () =>
  $fetch("/api/level", {
    lazy: false,
    server: false,
    method: "POST",
    headers: header,
    body: {},
  })
);

const { data: ratings } = await useAsyncData("ratings", () =>
  $fetch("/api/rating", {
    lazy: false,
    server: false,
    method: "POST",
    headers: header,
    body: {},
  })
);

const { data: technicals } = await useAsyncData(
  "technicals",
  () =>
    $fetch("/api/technicals", {
      lazy: false,
      server: false,
      method: "POST",
      headers: header,
      body: {},
    }),

  {}
);
</script>
