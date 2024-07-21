<template>
  <Suspense>
    <NuxtLayout>
      <UModal v-model="isOpen">
        <div class="fixed inset-0 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div class="flex justify-end">
              <UButton
                color="gray"
                size="md"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-3"
                @click="isOpen = false"
              />
            </div>
            <!-- Modal content -->
            <div class="text-center">
              <!-- You can add an icon here if needed -->
              <UIcon
                name="mynaui:letter-x"
                class="text-5xl text-red-500 mb-4"
              />
              <p class="text-lg text-gray-800 dark:te xt-white mb-2">
                Fail to Download
              </p>
              <!-- Add any additional content here -->
            </div>
          </div>
        </div>
      </UModal>

      <div class="flex justify-between space-x-16">
        <div class="flex space-x-3 ml-5">
          <!-- Start Date Picker -->
          <div class="date-picker-container">
            <label for="start-date" class="font-semibold">Start Date:</label>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                variant="soft"
                icon="i-heroicons-calendar-days-20-solid"
                :label="moment(startDate).format('D MMM, YYYY')"
              />

              <template #panel="{ close }">
                <VDatePicker v-model="startDate" :attributes="attrs" />
              </template>
            </UPopover>
          </div>

          <!-- End Date Picker -->
          <div class="date-picker-container">
            <label for="end-date" class="font-semibold">End Date:</label>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                variant="soft"
                icon="i-heroicons-calendar-days-20-solid"
                :label="moment(endDate).format('D MMM, YYYY')"
              />

              <template #panel="{ close }">
                <VDatePicker v-model="endDate" :attributes="attrs" />
              </template>
            </UPopover>
          </div>
          <div class="">
            <UButton
              variant="outline"
              color="blue"
              label="Search"
              @click="onSubmit"
            />
          </div>
        </div>

        <div class="mb-1 mr-2">
          <UButton
            icon="mynaui:cloud-download"
            variant="solid"
            color="green"
            label="Export Data"
            @click="exportData"
            :loading="loading"
          >
          </UButton>
        </div>
      </div>
      <TableData :data="listTicket" :loading="isLoading" />
      <div class="flex items-start w-full justify-end pt-1">
        <UPagination
          v-model="currentPage"
          :page-count="15"
          :max="7"
          :total="listTicket?.response.total_count || 0"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-lg min-w-[32px] justify-center',
            default: {
              activeButton: {},
            },
          }"
        />
      </div>
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import TableData from "./TableData.vue";

// middleware
definePageMeta({
  middleware: [function (to, from) {}],
});

// State
const location = useRoute();

const startDate = ref(moment().subtract(7, "day").toDate()); // Set start date to one week ago

const endDate = ref(new Date());

const selectedRow = ref(null);

const isOpen = ref(false);

const loading = ref(false);

const title = ref("");

const header = useRequestHeaders();

watch(selectedRow, (newRow) => {
  if (newRow) {
    title.value = newRow;
  }
});

//state
const state = ref<{
  startDate: string | null;
  endDate: string | null;
  route: string;
  page: string;
}>({
  startDate: moment(startDate.value).format("DD-MM-YYYY"),
  endDate: moment(endDate.value).format("DD-MM-YYYY"),
  route: location.path,
  page: "1",
});

const page = usePage();

const currentPageString = page.value;

const currentPage = ref(currentPageString ? currentPageString : 1);

const attrs = ref({
  key: "today",
  highlight: {
    color: "green",
    fillMode: "solid",
  },
  dates: new Date(),
});

const onSubmit = async () => {
  try {
    isLoading.value = true; // Set loading to true while fetching data

    const start = moment(startDate.value, "DD-MM-YYYY").format("YYYY-MM-DD");
    const end = moment(endDate.value, "DD-MM-YYYY").format("YYYY-MM-DD");

    // Send a request to your backend API to search data based on the date range
    const response = await $fetch("/api/ihreport", {
      method: "POST",
      headers: header,
      lazy: true,
      body: {
        startDate: start,
        endDate: end,
        page: currentPage.value,
        size: 15,
      },
    });

    listTicket.value = response;
  } catch (error) {
    console.error("Error searching by date range:", error);
    // Handle error appropriately, e.g., show error message to the user
  } finally {
    isLoading.value = false; // Set loading back to false after fetching data
  }
};

const {
  data: listTicket,
  pending: isLoading,
  error,
} = await useAsyncData(
  "ticket-list",
  async () => {
    const startFormatted = moment(startDate.value).format("YYYY-MM-DD");
    const endFormatted = moment(endDate.value).format("YYYY-MM-DD");

    const response = await $fetch("/api/ihreport", {
      method: "POST",
      lazy: true,
      server: false,
      headers: header,
      body: {
        startDate: startFormatted,
        endDate: endFormatted,
        page: currentPage.value,
        size: 15,
      },

      onResponse({ request, response, options }) {
        const data = response._data;

        data.response.data.forEach((ticket: any) => {
          // Format create_date if it exists
          if (ticket.create_date) {
            ticket.create_date = moment(ticket.create_date).format(
              "DD MMMM YYYY HH:mm A"
            );
          }
          // Format last_activity if it exists
          if (ticket.last_activity) {
            ticket.last_activity = moment(ticket.last_activity).format(
              "DD MMMM YYYY HH:mm A"
            );
          }
          // Format comment1_createdat if it exists
          if (ticket.comment1_createdat) {
            ticket.comment1_createdat = moment(
              ticket.comment1_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
          // Format comment2_createdat if it exists
          if (ticket.comment2_createdat) {
            ticket.comment2_createdat = moment(
              ticket.comment2_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
          // Format comment3_createdat if it exists
          if (ticket.comment3_createdat) {
            ticket.comment3_createdat = moment(
              ticket.comment3_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
        });
      },
    });
    return response;
  },
  {
    watch: [currentPage],
  }
);

const exportData = async () => {
  try {
    loading.value = true;
    const start = moment(startDate.value, "DD-MM-YYYY").format("YYYY-MM-DD");
    const end = moment(endDate.value, "DD-MM-YYYY").format("YYYY-MM-DD");
    const response = await $fetch("/api/ihexport", {
      method: "POST",
      headers: header,
      body: {
        startDate: start,
        endDate: end,
      },
      onResponse({ response }) {
        const data = response._data;
        const link = window.URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = link;
        tempLink.setAttribute("download", "all-quality-survey.xlsx");
        document.body.appendChild(tempLink);
        tempLink.click();
      },
    });
  } catch (error) {
    // Handle error appropriately, e.g., show error message to the user
    console.error("Error searching by date range:", error);
    isOpen.value = true;
  } finally {
    loading.value = false; // Set loading back to false after fetching data
  }
};

//rows
</script>
<style scoped>
.table-container {
  max-width: 100%;
  margin: auto;
  padding: 0 20px;
}

.cus-table ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.cus-table ::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.cus-table ::-webkit-scrollbar-thumb {
  background-color: #9f9f9f6c;
  border-radius: 10px;
}
.cus-table ::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  text-align: left;
}

.table tbody tr:hover {
  background-color: rgba(79, 70, 229, 0.05);
}
.table-container {
  height: 80vh;
  overflow: auto;
  scrollbar-width: thin;
}

.cus-table-wrapper {
  width: 100%;
  scrollbar-width: thin;
}

.cus-table {
  width: max-content;
  min-width: 100%;
}
.date-picker-container {
  display: flex;
  align-items: center;
}

.date-picker-container label {
  margin-right: 10px;
}
</style>
