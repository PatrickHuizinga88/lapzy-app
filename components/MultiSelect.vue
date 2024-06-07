<script setup lang="ts">
import { XCircle, Check, ChevronDown } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Option = {
  label: string;
  value: string;
};

const props = defineProps<{
  options: Option[];
  placeholder: string;
}>();

const isPopoverOpen = ref(false);
const selectedValues = ref<Option[]>([]);

const handleTogglePopover = () => {
  isPopoverOpen.value = !isPopoverOpen.value;
}

const toggleOption = (value: string) => {
  // const newSelectedValues = selectedValues.includes(value)
  //     ? selectedValues.filter((v) => v !== value)
  //     : [...selectedValues, value];
}

const getOptionByValue = (value) => {
  return props.options.find((o) => o.value === value) || {};
}
</script>

<template>
  <Popover :open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
          v-bind="$attrs"
          @click="handleTogglePopover"
          class="flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card"
      >
        <template v-if="selectedValues.length > 0">
          <div class="flex justify-between items-center w-full">
            <div class="flex flex-wrap items-center">
              <Badge v-for="value in selectedValues">
                {{ getOptionByValue(value).label }}
                <XCircle
                    class="ml-2 h-4 w-4 cursor-pointer"
                    @click.stop="toggleOption(value)"
                />
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <XIcon
                  class="h-4 mx-2 cursor-pointer text-muted-foreground"
                  @click.stop="selectedValues = []"
              />
              <Separator orientation="vertical" class="flex min-h-6 h-full" />
              <ChevronDown class="h-4 mx-2 cursor-pointer text-muted-foreground" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center justify-between w-full mx-auto">
            <span class="text-sm text-muted-foreground mx-3">{{ placeholder }}</span>
            <ChevronDown class="h-4 cursor-pointer text-muted-foreground mx-2" />
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent
        class="w-[200px] p-0 drop-shadow-sm"
        align="start"
        @escapeKeyDown="isPopoverOpen = false"
    >
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
                v-for="option in options"
                :key="option.value"
                @select="toggleOption(option.value)"
                :style="{ pointerEvents: 'auto', opacity: 1 }"
                class="cursor-pointer"
            >
              <div
                  :class="[
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.includes(option)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible'
                ]"
              >
                <Check class="h-4 w-4" />
              </div>
              <span>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <div class="flex items-center justify-between">
              <CommandItem
                  v-if="selectedValues.length > 0"
                  @select="selectedValues = []"
                  :style="{ pointerEvents: 'auto', opacity: 1 }"
                  class="flex-1 justify-center cursor-pointer"
              >
                Clear
              </CommandItem>
              <Separator v-if="selectedValues.length > 0" orientation="vertical" class="flex min-h-6 h-full" />
              <CommandSeparator />
              <CommandItem
                  @select="isPopoverOpen = false"
                  :style="{ pointerEvents: 'auto', opacity: 1 }"
                  class="flex-1 justify-center cursor-pointer"
              >
                Close
              </CommandItem>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped>

</style>