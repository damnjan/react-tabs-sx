import * as React from 'react'
import { Box, Flex, SxStyleProp } from 'rebass'

/** If clicked tab title is overflowing container, scroll to center it */
function scrollIfNeeded(container: HTMLElement, tabTitle: HTMLElement) {
  if (
    tabTitle.offsetLeft + tabTitle.clientWidth >
      container.scrollLeft + container.clientWidth ||
    container.scrollLeft > tabTitle.offsetLeft
  ) {
    container.scrollLeft =
      tabTitle.offsetLeft - container.clientWidth / 2 + tabTitle.clientWidth / 2
  }
}

interface TabTitleProps {
  label: string
  selected: boolean
  onClick: (event) => void
  sxTitle: SxStyleProp
  sxSelectedTitle: SxStyleProp
}

const TabTitle = ({
  label,
  selected,
  sxTitle,
  sxSelectedTitle,
  onClick,
}: TabTitleProps) => (
  <Box
    onClick={onClick}
    sx={
      {
        flexShrink: 0,
        py: 1,
        px: 4,
        whiteSpace: 'nowrap',
        color: selected ? 'primary' : '#555',
        fontWeight: selected ? 500 : 'normal',
        borderBottom: selected ? '2px solid' : 'none',
        borderBottomColor: 'primary',
        ...sxTitle,
        ...(selected ? sxSelectedTitle : {}),
      } as SxStyleProp
    }
  >
    {label}
  </Box>
)

interface TabProps {
  title: string
  children: React.ReactNode
}

/** Renders content if that tab is selected */
export const Tab: React.FunctionComponent<TabProps> = ({ children }) => (
  <>{children}</>
)

interface TabsProps {
  /** Index of currently selected tab */
  selectedTab: number
  onSelect: (tabIndex: number) => void
  /** Use display:none for non-selected tabs instead of mounting/unmounting them */
  persist?: boolean
  /** Children as <Tab /> elements */
  children: React.ReactNode
  /** Override styles for tab title component */
  sxTitle?: SxStyleProp
  /** Override styles for selected tab title component */
  sxSelectedTitle?: SxStyleProp
}

export const Tabs: React.FunctionComponent<TabsProps> = ({
  selectedTab,
  onSelect,
  persist,
  sxTitle,
  sxSelectedTitle,
  children,
}) => {
  const containerRef = React.useRef(null)

  const onTabClick = (event, tabIndex) => {
    scrollIfNeeded(containerRef.current, event.target)
    onSelect(tabIndex)
  }

  const childrenArray = React.Children.toArray(children) as React.ReactElement[]
  const titles = childrenArray.map(child => child.props.title)

  const tabs = persist
    ? childrenArray.map((child, index) => (
        <Box sx={{ display: index === selectedTab ? 'block' : 'none' }}>
          {child}
        </Box>
      ))
    : childrenArray.filter((child, index) => index === selectedTab)

  return (
    <Box>
      <Flex
        ref={containerRef}
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        {titles.map((tab, index) => (
          <TabTitle
            key={tab}
            label={tab}
            selected={selectedTab === index}
            sxTitle={sxTitle}
            sxSelectedTitle={sxSelectedTitle}
            onClick={event => {
              onTabClick(event, index)
            }}
          />
        ))}
      </Flex>
      <Box>{tabs}</Box>
    </Box>
  )
}
