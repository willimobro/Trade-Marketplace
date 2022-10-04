//
//  CategoryView.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct CategoryViewSortTEST: View {
    var body: some View {
        ZStack {
            VStack{
                CategoryNavigator()
                ScrollView(.vertical){
                    SearchViaCategory()
                    HStack(spacing: 15) {
                        VStack(spacing: 15)
                        {
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                    }
                        VStack(spacing: 15)
                        {
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                    }
                    }
                }
            }.ignoresSafeArea()
            VStack{
                Spacer()
                Sort()
                    .offset(y: 30)
            }.ignoresSafeArea()
        }
    }
}

struct CategoryViewSortTEST_Previews: PreviewProvider {
    static var previews: some View {
        CategoryViewSortTEST()
    }
}

