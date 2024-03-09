import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { Lookup } from "../interface/lookup.interface"
import { Injectable } from "@angular/core"
import { GetLookup } from "../action/lookup.action";
import { LookupService } from "../services/lookup.service";
import { tap } from "rxjs";

export class LookupStateModel {
    lookup = {
      sh: [] as Lookup[],
      lg: [] as Lookup[]
    }
  }

  @State<LookupStateModel>({
    name: "lookup",
    defaults: {
      lookup: {
        sh: [],
        lg: []
      }
    },
  })
@Injectable()
export class LookUpState {
    constructor(private store: Store, private lookupService: LookupService){}

  @Selector()
  static showType(state: LookupStateModel) {
    return state.lookup.sh;
  }

  @Selector()
  static language(state: LookupStateModel) {
    return state.lookup.lg;
  }

  @Selector()
  static showTypeSelect(state: LookupStateModel) {
    return state.lookup.sh.map(sh => {
      return { label: sh?.value, value: sh?.id }
    });
  }
  @Selector()
  static languageSelect(state: LookupStateModel) {
    return state.lookup.lg.map(sh => {
      return { label: sh?.value, value: sh?.id }
    });
  }

  @Action(GetLookup)
  getLookup(ctx: StateContext<LookupStateModel>, action: GetLookup) {
    return this.lookupService.lookups().pipe(
      tap({
        next: result => { 
          console.log(result);
          result.data.lg;
         // const transformedData = Object.keys(result.data.lg).map(key => result.data.lg[key]);
         var lg = [];
        Object.keys(result.data.lg).map(function (key) {
          
            var it =  {};
                it["id"] = key;
                it["value"] =   result.data.lg[key];                    
                lg.push(it);
            return lg;
        });

        var sh = [];
        Object.keys(result.data.sh).map(function (key) {
          
            var it =  {};
                it["id"] = key;
                it["value"] =   result.data.sh[key];                    
                sh.push(it);
            return sh;
        });
        // console.log({
        //     sh: sh,
        //     lg: lg
        //   });
          ctx.patchState({
            lookup: {
              sh: sh,
              lg: lg
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }
}