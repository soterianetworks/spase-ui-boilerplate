import {
    BootstrapModule,
    AuthzModule,
    EventModule,
    I18nModule,
    EnhancedHttpModule,
    EnhancedRouteModule,

    AppPaginationModule,
    ButtonBarModule,
    AppFormModule,
    SnCalendarModule,
    SmartSelectModule,
    QuickSearchModule,
    ValidateModule,
    ButtonGroupModule,
} from 'spase-ui';

import {PrimeModule} from 'spase-ui/primeng';

export const SpaseModule: any = [
    BootstrapModule,
    AuthzModule,
    EventModule,
    I18nModule,
    EnhancedHttpModule,
    EnhancedRouteModule,

    AppPaginationModule,
    ButtonBarModule,
    AppFormModule,
    SnCalendarModule,
    SmartSelectModule,
    QuickSearchModule,
    ValidateModule,
    ButtonGroupModule,

    ...PrimeModule,
];
