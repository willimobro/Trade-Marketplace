//
//  ListjobView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//
import MapKit
import SwiftUI

struct ListjobView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack{
            HStack(spacing: 30){
                Button{
                    dismiss()
                } label: {
                Image(systemName: "xmark")
                    .resizable()
                    .scaledToFit()
                }
                Text("Quote a Job")
                    .font(.custom("Poppins-SemiBold", size: 28))
            }.frame(width: 321, height: 24, alignment: .leading)
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: 4, x: 0, y: 0)
                .opacity(0.5)
            
            ScrollView(.vertical){
            VStack(alignment: .leading, spacing: 10){
            Text("Title")
                .font(.custom("Poppins-SemiBold", size: 28))
            
            ProfileSub()
                    .padding(.horizontal, 5)
            Text("Details")
                    .font(.custom("Poppins-SemiBold", size: 28))
            Text("Need someone to check my wires, have been trying to get it to work for days and cant figure it out lol.")
                        .font(.custom("Poppins-SemiBold", size: 16))
            ListJobContent()
            
            }
            }.frame(width: 351, height: .infinity, alignment: .center)
        }  .navigationBarTitleDisplayMode(.inline)
            .navigationBarHidden(true)
        
    }
}



struct ListjobView_Previews: PreviewProvider {
    static var previews: some View {
        ListjobView()
    }
}

struct ListJobContent: View {
    @State var QuotedTime = Date()
    @State var QuotedLocation : Bool = false
    @State var QuotedLabour = String()
    @State var QuotedOther = String()
    @State var QuotedFuel = String()
    @State var QuotedMaterial = String()
    @State var QuotedComment = String()
    @State var Cost = String()
    @State var Expense = String()
    @State var pricematerial = Int()
    @State var pricelabour = Int()
    @State var pricefuel = Int()
    @State var priceother = Int()
    @State var pricetotal = Int()
    @State var acceptbutton = false
    
    func total()
    {
       pricetotal =  pricematerial + pricelabour + pricefuel + priceother
    }
    
    var body: some View {
        Text("Prefered Date")
            .font(.custom("Poppins-SemiBold", size: 28))
        DatePicker(
                "Date",
                selection: $QuotedTime,
                displayedComponents: [.date]
            )
            .datePickerStyle(.graphical)
            .accentColor(.green)
        
        Text("Where")
            .font(.custom("Poppins-SemiBold", size: 28))
            VStack (alignment: .center, spacing: 10){
                Picker("Option1", selection: $QuotedLocation) {
                    Text("You will travel to your Client.")
                }
                Picker("Option2", selection: $QuotedLocation) {
                    Text("Your Client will travel to you.")
                    }
                .padding(.bottom, 10)
                MapView()
                }
            .pickerStyle(.segmented)
       
            Text("Comments")
            .font(.custom("Poppins-SemiBold", size: 28))
            TextField("Any message to the client", text: $QuotedComment)
            .font(.headline)
            .frame(width: .infinity, height: 150, alignment: .topLeading)
            .textFieldStyle(.roundedBorder)
        VStack(alignment: .leading, spacing: 5){
            Text("Material Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
            HStack {
                TextField("Add a Cost", text: $QuotedMaterial)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField("$", value: $pricematerial, format: .currency(code: "NZD"))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                
            }
            Text("Labour Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
            HStack {
                TextField("Add a Cost", text: $QuotedLabour)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField("$", value: $pricelabour, format: .currency(code: "NZD"))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
            }
            Text("Fuel Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
            HStack {
                TextField("Add a Cost", text: $QuotedFuel)
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                TextField("$", value: $pricefuel, format: .currency(code: "NZD"))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
            }
            Text("Other Costs")
            .font(.custom("Poppins-SemiBold", size: 28))
            .textFieldStyle(.roundedBorder)
            HStack {
                TextField("Add a Cost", text: $QuotedOther)
                        .font(.headline)
                        .textFieldStyle(.roundedBorder)
                TextField("$", value: $priceother, format: .currency(code: "NZD"))
                    .font(.headline)
                    .textFieldStyle(.roundedBorder)
                
            }
        }
        FinalCostCalculator(totalcost: pricetotal)
        RoundedRectangle(cornerRadius: 11)
                .frame(width: .infinity, height: 180)
                .foregroundColor(.gray.opacity(0.10))
                .overlay(VStack{
                    HStack (spacing: 10) {
                        Button(action:{
                            acceptbutton = true
                        }){
                            Image(systemName: acceptbutton ? "checkmark.square.fill" : "checkmark.square")
                            .resizable()
                            .frame(width: 36, height: 36)
                            .foregroundColor(.green)
                        }
                        Text("Im happy with the quote and accept any terms or conditions")
                            .font(.custom("Poppins-SemiBold", size: 18))
                    }
                    QuoteNowButton()
                }
                    .frame(width: 371, alignment: .center))
        }
    }


struct FinalCostCalculator: View {
@State var totalcost = Int()
    var body: some View {
        Text("Final Cost")
            .font(.custom("Poppins-SemiBold", size: 30))
            .textFieldStyle(.roundedBorder)
        Text("\(totalcost)")
            .font(.custom("Poppins-SemiBold", size: 30))
            .textFieldStyle(.roundedBorder)
            .foregroundColor(.green)
    
    }
}
