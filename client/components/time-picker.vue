<script setup lang="ts">
const date = defineModel<Date>();

const hours = [9, 10, 11, 12, 3, 4];
const minutes = [0, 15, 30, 45];

const updateTime = (hour: number, minute: number) => {
  const currentDate = date.value ? new Date(date.value) : new Date();
  const period = hour >= 9 && hour <= 11 ? "AM" : "PM";
  const adjustedHour =
    period === "PM" && hour !== 12
      ? hour + 12
      : period === "AM" && hour === 12
      ? 0
      : hour;
  currentDate.setHours(adjustedHour, minute, 0, 0);
  date.value = currentDate;
};
</script>

<template>
  <div class="timepicker">
    <select @change="updateTime(Number($event.target?.value), date?.getMinutes() || 0)">
      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
    </select>
    :
    <select @change="updateTime(date?.getHours() || 9, Number($event.target?.value))">
      <option v-for="minute in minutes" :key="minute" :value="minute">
        {{ minute.toString().padStart(2, "0") }}
      </option>
    </select>
    <span>{{
      (date?.getHours() || 9) >= 9 && (date?.getHours() || 9) <= 11 ? "AM" : "PM"
    }}</span>
  </div>
</template>

<style scoped lang="sass">
.timepicker
  display: flex
  gap: 0.5rem
  font-size: 1.2rem
  border: 2px solid #4ade80
  border-radius: 20px
  padding: 0 .5rem
  overflow: hidden
</style>
