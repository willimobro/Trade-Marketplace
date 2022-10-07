//
//  CategoryNavigator.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct CategoryNavigator: View {
    @Environment(\.dismiss) var dismiss
    @State var category = ""
    @State var leftbuttonenabled = Bool()
    @State var rightbuttonenabled = Bool()
    var body: some View {
        Rectangle()
            .frame(height: 84, alignment: .bottom)
            .foregroundColor(/*@START_MENU_TOKEN@*/Color("CanvasColor")/*@END_MENU_TOKEN@*/)
            .overlay(HStack{
                Button{
                    dismiss()
                } label:    {
                    if leftbuttonenabled {
                        Image(systemName: "chevron.left")
                            .resizable()
                        .frame(width: 19, height: 31)}
                }
                Text("\(category)")
                    .font(.custom("Poppins-SemiBold", size: 20))
                    .padding(.leading, 12)
                Spacer()
                Button{
                    print("hello")
                } label:    {
                    if rightbuttonenabled {
                        Image(systemName: "plus.app.fill")
                            .resizable()
                        .frame(width: 30, height: 31)}
                }
            }
                .foregroundColor(.white)
                .padding(.horizontal, 25)
                .frame(height: 64, alignment: .bottom)
            )
    }
}

struct CategoryNavigator_Previews: PreviewProvider {
    static var previews: some View {
        CategoryNavigator()
    }
}

